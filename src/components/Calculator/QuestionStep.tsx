'use client';

import { CadastralField, NumberField, TextField } from '@/components/Input/Input';
import { OptionGroup } from '@/components/OptionTile/OptionGroup';
import type { Option } from '@/components/OptionTile/OptionTile';
import { NormLink } from '@/components/Primitives/Primitives';

import { UNKNOWN, type Question, type Value } from '@/engine/schema';
import { formatNumber, parseDecimal } from '@/lib/format';
import { LocationInput, type LocationValue } from './LocationInput';
import { toggleMulti, visibleOptions, type Draft } from './quiz';

export interface QuestionStepProps {
  question: Question;
  draft: Draft;
  onDraft: (d: Draft) => void;
  error?: string;
  /** Ответы с учётом допущений — для фильтра вариантов по ветке */
  values: Record<string, Value>;
  location?: LocationValue;
  /** Вопрос, встроенный в этот шаг (кадастровый номер в «Участке») */
  embedded?: { question: Question; value: string; onChange: (v: string) => void };
}

const BOOLEAN_OPTIONS: Option[] = [
  { value: 'true', label: 'Да' },
  { value: 'false', label: 'Нет' },
];

/** components/calc-step.md — вопрос (h2), пояснение «почему спрашиваем», варианты / поле, ошибка. */
export function QuestionStep({ question: q, draft, onDraft, error, values, location, embedded }: QuestionStepProps) {
  const unknownOption: Option[] = q.unknown ? [{ value: UNKNOWN, label: q.unknown.label, hint: q.unknown.note, unknown: true }] : [];
  const isUnknown = draft === UNKNOWN || (Array.isArray(draft) && draft.includes(UNKNOWN));
  const unknownTile = q.unknown ? (
    <OptionGroup name={`${q.id}-unknown`} legend="Или" legendHidden options={unknownOption} value={isUnknown ? UNKNOWN : null} onChange={onDraft} />
  ) : null;

  let control;
  if (q.kind === 'choice' || q.kind === 'boolean') {
    const options = q.kind === 'boolean' ? BOOLEAN_OPTIONS : visibleOptions(q, values);
    control = <OptionGroup name={q.id} legend={q.title} legendHidden options={[...options, ...unknownOption]} value={typeof draft === 'string' ? draft : null} onChange={onDraft} />;
  } else if (q.kind === 'multi') {
    const prev = Array.isArray(draft) ? draft : [];
    control = (
      <OptionGroup mode="multi" name={q.id} legend={q.title} legendHidden options={[...visibleOptions(q, values), ...unknownOption]} value={prev} onChange={(next) => onDraft(toggleMulti(prev, next))} />
    );
  } else if (q.kind === 'dims') {
    const [l, w] = Array.isArray(draft) && !isUnknown ? draft : ['', ''];
    const ln = parseDecimal(l);
    const wn = parseDecimal(w);
    control = (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Длина" unit="м" value={l} onChange={(e) => onDraft([e.target.value, w])} />
          <NumberField label="Ширина" unit="м" value={w} onChange={(e) => onDraft([l, e.target.value])} />
        </div>
        <p aria-live="polite" className="m-0 min-h-6 type-body text-text-secondary nums">
          {ln && wn ? `Пятно ${formatNumber(Math.round(ln * wn))} м²` : null}
        </p>
        {error ? (
          <p role="alert" className="m-0 type-small text-status-error">
            {error}
          </p>
        ) : null}
        {unknownTile}
      </div>
    );
  } else if (q.kind === 'number' && q.ui === 'map' && location) {
    control = (
      <LocationInput question={q} draft={draft} onDraft={onDraft} error={error} {...location}>
        {embedded ? <CadastralField label={embedded.question.title} hint={embedded.question.hint} value={embedded.value} onChange={(e) => embedded.onChange(e.target.value)} /> : null}
      </LocationInput>
    );
  } else if (q.kind === 'number') {
    control = (
      <div className="flex flex-col gap-4">
        <NumberField label={q.title} labelHidden unit={q.number!.unit} value={isUnknown || draft === null ? '' : String(draft)} onChange={(e) => onDraft(e.target.value)} error={error} />
        {unknownTile}
      </div>
    );
  } else {
    control = <TextField label={q.title} labelHidden value={typeof draft === 'string' ? draft : ''} onChange={(e) => onDraft(e.target.value)} error={error} />;
  }

  const showsOwnError = q.kind === 'number' || q.kind === 'text' || q.kind === 'dims';

  return (
    <div className="flex flex-col gap-4">
      {control}
      {error && !showsOwnError ? (
        <p role="alert" className="m-0 type-small text-status-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Пояснение «почему спрашиваем» под заголовком шага. */
export function WhyWeAsk({ question: q }: { question: Question }) {
  if (!q.why && !q.hint) return null;
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="m-0 max-w-measure type-body text-text-secondary">{q.why?.text ?? q.hint}</p>
      {q.why?.text && q.hint ? <p className="m-0 type-small text-text-muted">{q.hint}</p> : null}
      {q.why?.norm ? <NormLink code={q.why.norm.code} small /> : null}
    </div>
  );
}


'use client';

import { NormRef } from '@/components/NormRef/NormRef';
import { AssumptionNote } from '@/components/Assumption/Assumption';
import { CadastralField, NumberField, TextField } from '@/components/Field/Field';
import { OptionGroup } from '@/components/OptionTile/OptionGroup';
import type { Option } from '@/components/OptionTile/OptionTile';
import { UNKNOWN, type Question } from '@/engine/schema';
import { LocationInput, type LocationValue } from './LocationInput';
import { toggleMulti, type Draft } from './quiz';

export interface QuestionStepProps {
  question: Question;
  draft: Draft;
  onDraft: (d: Draft) => void;
  error?: string;
  location?: LocationValue;
}

const BOOLEAN_OPTIONS: Option[] = [
  { value: 'true', label: 'Да' },
  { value: 'false', label: 'Нет' },
];

export function QuestionStep({ question: q, draft, onDraft, error, location }: QuestionStepProps) {
  const unknownOption: Option[] = q.unknown ? [{ value: UNKNOWN, label: q.unknown.label, hint: q.unknown.note, unknown: true }] : [];
  const isUnknown = draft === UNKNOWN || (Array.isArray(draft) && draft.includes(UNKNOWN));

  let control;
  if (q.kind === 'choice' || q.kind === 'boolean') {
    const options = q.kind === 'boolean' ? BOOLEAN_OPTIONS : (q.options ?? []);
    control = (
      <OptionGroup
        name={q.id}
        legend={q.title}
        legendHidden
        options={[...options, ...unknownOption]}
        value={typeof draft === 'string' ? draft : null}
        onChange={onDraft}
      />
    );
  } else if (q.kind === 'multi') {
    const prev = Array.isArray(draft) ? draft : [];
    control = (
      <OptionGroup
        mode="multi"
        name={q.id}
        legend={q.title}
        legendHidden
        options={[...(q.options ?? []), ...unknownOption]}
        value={prev}
        onChange={(next) => onDraft(toggleMulti(prev, next))}
      />
    );
  } else if (q.kind === 'number' && q.ui === 'map' && location) {
    control = <LocationInput question={q} draft={draft} onDraft={onDraft} error={error} {...location} />;
  } else if (q.kind === 'number') {
    control = (
      <div className="flex flex-col gap-3">
        <NumberField
          label={q.title}
          labelHidden
          unit={q.number!.unit}
          value={isUnknown || draft === null ? '' : String(draft)}
          onChange={(e) => onDraft(e.target.value)}
          error={error}
        />
        {q.unknown ? (
          <OptionGroup name={`${q.id}-unknown`} legend="Или" legendHidden options={unknownOption} value={isUnknown ? UNKNOWN : null} onChange={onDraft} />
        ) : null}
      </div>
    );
  } else if (q.id === 'cadastral') {
    control = <CadastralField label={q.title} labelHidden hint="Формат: 56:44:0301001:123" value={typeof draft === 'string' ? draft : ''} onChange={(e) => onDraft(e.target.value)} error={error} />;
  } else {
    control = <TextField label={q.title} labelHidden value={typeof draft === 'string' ? draft : ''} onChange={(e) => onDraft(e.target.value)} error={error} />;
  }

  const showsOwnError = q.kind === 'number' || q.kind === 'text';

  return (
    <div className="flex flex-col gap-5">
      {control}
      {error && !showsOwnError ? (
        <p role="alert" className="m-0 text-sm text-status-error">
          {error}
        </p>
      ) : null}
      {isUnknown && q.unknown ? <AssumptionNote>В результате это будет отмечено отдельно, инженер уточнит с вами.</AssumptionNote> : null}
      {q.why ? (
        <div className="flex flex-col items-start gap-2 border-t border-dashed border-border-control pt-4">
          <span className="text-sm font-semibold">Зачем мы это спрашиваем</span>
          <span className="text-sm leading-normal text-text-secondary">{q.why.text}</span>
          {q.why.norm ? <NormRef code={q.why.norm.code} /> : null}
        </div>
      ) : null}
    </div>
  );
}

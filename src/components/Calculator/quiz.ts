// Логика квиза без UI: какие шаги видны, как хранятся ответы, что можно отправить.
import { checkValue, resolveAnswers } from '@/engine/answers';
import { evalCondition } from '@/engine/expr';
import { formatDims, parseDims } from '@/engine/dims';
import { UNKNOWN, type Answers, type Question, type Value } from '@/engine/schema';
import { formatNumber, parseDecimal } from '@/lib/format';

/** Шаги квиза при текущих ответах (неотвеченные считаются «не знаю»). */
export function visibleQuestions(questions: Question[], answers: Answers): Question[] {
  const ids = new Set(resolveAnswers(questions, answers).visible);
  return questions.filter((q) => ids.has(q.id));
}

/** Варианты ответа, доступные при текущих ответах (option.show_if — например, «коммерческий» только в общей ветке). */
export function visibleOptions(q: Question, values: Record<string, Value>) {
  return (q.options ?? []).filter((o) => !o.show_if || evalCondition(o.show_if, values));
}

/** Только ответы, нужные для расчёта: скрытые после смены ответа не уходят в расчёт и ссылку. Пресеты ветки остаются. */
export function pruneAnswers(questions: Question[], answers: Answers): Answers {
  const relevant = new Set(resolveAnswers(questions, answers).relevant);
  return Object.fromEntries(Object.entries(answers).filter(([k, v]) => relevant.has(k) && v !== ''));
}

export type Draft = string | string[] | null;

/** Ответ → значение для контрола. boolean в плитках — 'true'/'false'; габариты — ['12', '9']. */
export function toDraft(q: Question, v: Answers[string] | undefined): Draft {
  if (v === undefined) return q.kind === 'multi' ? [] : q.kind === 'dims' ? ['', ''] : null;
  if (v === UNKNOWN) return q.kind === 'multi' ? [UNKNOWN] : UNKNOWN;
  if (q.kind === 'boolean') return String(v);
  if (q.kind === 'number') return String(v).replace('.', ',');
  if (q.kind === 'dims') {
    const d = parseDims(v);
    return d ? [String(d.length).replace('.', ','), String(d.width).replace('.', ',')] : ['', ''];
  }
  return v as string | string[];
}

export type DraftResult = { ok: true; value: Answers[string] | undefined } | { ok: false; error: string };

/** Черновик контрола → ответ. undefined — ответа нет (для необязательных вопросов). */
export function fromDraft(q: Question, d: Draft): DraftResult {
  if (d === UNKNOWN || (Array.isArray(d) && d.includes(UNKNOWN))) return { ok: true, value: UNKNOWN };
  const empty = d === null || d === '' || (Array.isArray(d) && d.every((x) => x === ''));
  if (empty) return q.lead_only ? { ok: true, value: undefined } : { ok: false, error: 'Выберите вариант или «Не знаю»' };

  let value: Value;
  if (q.kind === 'boolean') value = d === 'true';
  else if (q.kind === 'number') {
    const n = parseDecimal(String(d));
    if (n === null) return { ok: false, error: 'Введите число' };
    value = n;
  } else if (q.kind === 'dims') {
    const [l, w] = (d as string[]).map((x) => parseDecimal(x));
    if (l === null || w === null) return { ok: false, error: 'Введите длину и ширину в метрах' };
    value = formatDims({ length: l, width: w });
  } else value = d as string | string[];

  const err = checkValue(q, value);
  if (err) return { ok: false, error: err[0].toUpperCase() + err.slice(1) };
  return { ok: true, value };
}

/** Выбор в мультивопросе: «Не знаю» исключает остальные варианты и наоборот. */
export function toggleMulti(prev: string[], next: string[]): string[] {
  const added = next.find((v) => !prev.includes(v));
  if (added === UNKNOWN) return [UNKNOWN];
  return next.filter((v) => v !== UNKNOWN);
}

/** Ответ словами — для сводки «Ваш объект», результата и PDF. */
export function answerText(q: Question, v: Answers[string] | undefined): string {
  if (v === undefined) return '—';
  if (v === UNKNOWN) return 'не знаю';
  if (Array.isArray(v)) return v.map((x) => q.options?.find((o) => o.value === x)?.label ?? x).join(', ');
  if (typeof v === 'boolean') return v ? 'да' : 'нет';
  if (q.kind === 'dims') {
    const d = parseDims(v);
    return d ? `${formatNumber(d.length)} × ${formatNumber(d.width)} м (${formatNumber(Math.round(d.length * d.width))} м²)` : String(v);
  }
  const opt = q.options?.find((o) => o.value === String(v));
  if (opt) return opt.label;
  return typeof v === 'number' ? `${formatNumber(v)} ${q.number?.unit ?? ''}`.trim() : String(v);
}

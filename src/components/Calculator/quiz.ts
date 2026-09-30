// Логика квиза без UI: какие шаги видны, как хранятся ответы, что можно отправить.
import { checkValue, resolveAnswers } from '@/engine/answers';
import { UNKNOWN, type Answers, type Question, type Value } from '@/engine/schema';
import { parseDecimal } from '@/lib/format';

/** Вопросы, которые видны при текущих ответах (неотвеченные считаются «не знаю»). */
export function visibleQuestions(questions: Question[], answers: Answers): Question[] {
  const ids = new Set(resolveAnswers(questions, answers).visible);
  return questions.filter((q) => ids.has(q.id));
}

/** Только ответы на видимые вопросы: скрытые (после смены ответа) не уходят в расчёт и ссылку. */
export function pruneAnswers(questions: Question[], answers: Answers): Answers {
  const visible = new Set(visibleQuestions(questions, answers).map((q) => q.id));
  return Object.fromEntries(Object.entries(answers).filter(([k, v]) => visible.has(k) && v !== ''));
}

export type Draft = string | string[] | null;

/** Ответ → значение для контрола. boolean хранится как true/false, в плитках — 'true'/'false'. */
export function toDraft(q: Question, v: Answers[string] | undefined): Draft {
  if (v === undefined) return q.kind === 'multi' ? [] : null;
  if (v === UNKNOWN) return q.kind === 'multi' ? [UNKNOWN] : UNKNOWN;
  if (q.kind === 'boolean') return String(v);
  if (q.kind === 'number') return String(v).replace('.', ',');
  return v as string | string[];
}

export type DraftResult = { ok: true; value: Answers[string] | undefined } | { ok: false; error: string };

/** Черновик контрола → ответ. undefined — ответа нет (для необязательных вопросов). */
export function fromDraft(q: Question, d: Draft): DraftResult {
  const empty = d === null || d === '' || (Array.isArray(d) && d.length === 0);
  if (empty) return q.lead_only ? { ok: true, value: undefined } : { ok: false, error: 'Выберите вариант или «Не знаю»' };
  if (d === UNKNOWN || (Array.isArray(d) && d.includes(UNKNOWN))) return { ok: true, value: UNKNOWN };

  let value: Value;
  if (q.kind === 'boolean') value = d === 'true';
  else if (q.kind === 'number') {
    const n = parseDecimal(String(d));
    if (n === null) return { ok: false, error: 'Введите число' };
    value = n;
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

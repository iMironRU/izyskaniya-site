// Разбор ответов: видимость вопросов, «не знаю» → допущение, проверка значений.
import { evalCondition, type Resolved } from './expr';
import { parseDims } from './dims';
import { UNKNOWN, type Answers, type Assumption, type Question, type Value } from './schema';

export class AnswerError extends Error {
  constructor(
    public readonly question: string,
    message: string,
  ) {
    super(message);
    this.name = 'AnswerError';
  }
}

export interface ResolvedAnswers {
  values: Resolved;
  assumptions: Assumption[];
  /** Шаги, которые клиент видит при этих ответах, в порядке показа (без встроенных и незадаваемых) */
  visible: string[];
  /** Все вопросы, нужные для расчёта при этих ответах (включая незадаваемые и встроенные) */
  relevant: string[];
}

/** Задаётся ли вопрос в текущей ветке. Незадаваемый берёт default без пометки «допущение». */
export function isAsked(q: Question, values: Resolved): boolean {
  return !q.ask_if || evalCondition(q.ask_if, values);
}

export function isVisible(q: Question, values: Resolved): boolean {
  return !q.show_if || evalCondition(q.show_if, values);
}

export function checkValue(q: Question, v: Value): string | null {
  switch (q.kind) {
    case 'choice':
      return typeof v === 'string' && q.options?.some((o) => o.value === v) ? null : 'нет такого варианта';
    case 'multi':
      return Array.isArray(v) && v.length > 0 && v.every((x) => q.options?.some((o) => o.value === x))
        ? null
        : 'нужен хотя бы один вариант из списка';
    case 'boolean':
      return typeof v === 'boolean' ? null : 'нужно да или нет';
    case 'number': {
      if (typeof v !== 'number' || !Number.isFinite(v)) return 'нужно число';
      const n = q.number!;
      return v < n.min || v > n.max ? `допустимо от ${n.min} до ${n.max} ${n.unit}` : null;
    }
    case 'text':
      return typeof v === 'string' ? null : 'нужен текст';
    case 'dims': {
      const d = parseDims(v);
      if (!d) return 'нужны длина и ширина';
      const n = q.number!;
      return [d.length, d.width].some((x) => x < n.min || x > n.max) ? `каждый размер — от ${n.min} до ${n.max} ${n.unit}` : null;
    }
  }
}

/**
 * Проходит вопросы по порядку. Скрытые пропускает, «не знаю» и пропущенные
 * заменяет допущением (если у вопроса оно есть). Вопросы только для заявки
 * (lead_only) в расчёт не попадают.
 */
export function resolveAnswers(questions: Question[], raw: Answers): ResolvedAnswers {
  const values: Resolved = {};
  const assumptions: Assumption[] = [];
  const visible: string[] = [];
  const relevant: string[] = [];

  for (const q of questions) {
    if (!isVisible(q, values)) continue;
    relevant.push(q.id);

    if (!isAsked(q, values)) {
      const given = raw[q.id];
      const ok = given !== undefined && given !== UNKNOWN && !checkValue(q, given);
      const v = ok ? given : (q.default ?? q.unknown?.assume);
      if (v !== undefined && !q.lead_only) values[q.id] = v as Value;
      continue;
    }
    if (!q.embed) visible.push(q.id);
    if (q.lead_only) continue;

    const given = raw[q.id];
    if (given === undefined || given === UNKNOWN) {
      if (!q.unknown) throw new AnswerError(q.id, `Нет ответа на «${q.title}»`);
      values[q.id] = q.unknown.assume;
      assumptions.push({ question: q.id, title: q.title, assumed: q.unknown.assume, note: q.unknown.note });
      continue;
    }
    const err = checkValue(q, given);
    if (err) throw new AnswerError(q.id, `«${q.title}»: ${err}`);
    values[q.id] = given;
  }

  return { values, assumptions, visible, relevant };
}

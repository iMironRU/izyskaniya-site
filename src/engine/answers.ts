// Разбор ответов: видимость вопросов, «не знаю» → допущение, проверка значений.
import { evalCondition, type Resolved } from './expr';
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
  /** Вопросы, которые клиент должен увидеть при этих ответах, в порядке показа */
  visible: string[];
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

  for (const q of questions) {
    if (!isVisible(q, values)) continue;
    visible.push(q.id);
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

  return { values, assumptions, visible };
}

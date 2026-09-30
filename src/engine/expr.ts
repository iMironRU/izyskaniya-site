// Вычисление условий и выражений из правил. Чистые функции.
import type { Condition, Expr, Value } from './schema';

export type Resolved = Record<string, Value>;

export interface ExprContext {
  answers: Resolved;
  refs: Record<string, number>;
}

export class DataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataError';
  }
}

const same = (a: Value | undefined, b: Value) => a !== undefined && String(a) === String(b);

// Не заданный ответ (вопрос скрыт) ни с чем не совпадает: in/includes/gt/lte → false, not_in → true.
export function evalCondition(c: Condition, answers: Resolved): boolean {
  if ('all' in c) return c.all.every((x) => evalCondition(x, answers));
  if ('any' in c) return c.any.some((x) => evalCondition(x, answers));
  const v = answers[c.q];
  if ('in' in c) return c.in.some((x) => same(v, x));
  if ('not_in' in c) return !c.not_in.some((x) => same(v, x));
  if ('includes' in c) return Array.isArray(v) && v.includes(c.includes);
  if ('gt' in c) return typeof v === 'number' && v > c.gt;
  if ('lte' in c) return typeof v === 'number' && v <= c.lte;
  return false;
}

function numberAnswer(q: string, answers: Resolved): number {
  const v = answers[q];
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  throw new DataError(`Ответ «${q}» не число (${JSON.stringify(v)})`);
}

export function evalExpr(e: Expr, ctx: ExprContext): number {
  if (typeof e === 'number') return e;
  if ('answer' in e) return numberAnswer(e.answer, ctx.answers);
  if ('ref' in e) {
    const r = ctx.refs[e.ref];
    if (r === undefined) throw new DataError(`Величина «${e.ref}» не определена`);
    return r;
  }
  if ('lookup' in e) {
    const key = String(ctx.answers[e.lookup.q]);
    const r = e.lookup.map[key];
    if (r === undefined) throw new DataError(`lookup «${e.lookup.q}»: нет значения для «${key}»`);
    return r;
  }
  if ('table' in e) {
    const x = numberAnswer(e.table.q, ctx.answers);
    const row = e.table.rows.find((r) => r.max === null || x <= r.max);
    if (!row) throw new DataError(`table «${e.table.q}»: значение ${x} вне таблицы`);
    return row.value;
  }
  if ('sum' in e) return e.sum.reduce<number>((s, x) => s + evalExpr(x, ctx), 0);
  if ('mul' in e) return e.mul.reduce<number>((s, x) => s * evalExpr(x, ctx), 1);
  if ('div' in e) {
    const d = evalExpr(e.div[1], ctx);
    if (d === 0) throw new DataError('Деление на ноль');
    return evalExpr(e.div[0], ctx) / d;
  }
  if ('max' in e) return Math.max(...e.max.map((x) => evalExpr(x, ctx)));
  if ('min' in e) return Math.min(...e.min.map((x) => evalExpr(x, ctx)));
  if ('ceil' in e) return Math.ceil(evalExpr(e.ceil, ctx) - 1e-9);
  if ('if' in e) return evalCondition(e.if, ctx.answers) ? evalExpr(e.then, ctx) : evalExpr(e.else, ctx);
  throw new DataError(`Неизвестное выражение ${JSON.stringify(e)}`);
}

/** Все вопросы, на ответы которых ссылается выражение или условие. Нужно для проверки данных. */
export function referencedQuestions(node: Expr | Condition | undefined, out = new Set<string>()): Set<string> {
  if (node === undefined || typeof node === 'number') return out;
  if ('q' in node) out.add(node.q);
  if ('answer' in node) out.add(node.answer);
  if ('lookup' in node) out.add(node.lookup.q);
  if ('table' in node) out.add(node.table.q);
  if ('all' in node) node.all.forEach((x) => referencedQuestions(x, out));
  if ('any' in node) node.any.forEach((x) => referencedQuestions(x, out));
  for (const k of ['sum', 'mul', 'max', 'min'] as const) {
    if (k in node) (node as Record<typeof k, Expr[]>)[k].forEach((x) => referencedQuestions(x, out));
  }
  if ('div' in node) node.div.forEach((x) => referencedQuestions(x, out));
  if ('ceil' in node) referencedQuestions(node.ceil, out);
  if ('if' in node) {
    referencedQuestions(node.if, out);
    referencedQuestions(node.then, out);
    referencedQuestions(node.else, out);
  }
  return out;
}

export function referencedRefs(node: Expr | Condition | undefined, out = new Set<string>()): Set<string> {
  if (node === undefined || typeof node === 'number') return out;
  if ('ref' in node) out.add(node.ref);
  for (const k of ['sum', 'mul', 'max', 'min'] as const) {
    if (k in node) (node as Record<typeof k, Expr[]>)[k].forEach((x) => referencedRefs(x, out));
  }
  if ('div' in node) node.div.forEach((x) => referencedRefs(x, out));
  if ('ceil' in node) referencedRefs(node.ceil, out);
  if ('if' in node) {
    referencedRefs(node.then, out);
    referencedRefs(node.else, out);
  }
  return out;
}

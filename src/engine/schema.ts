// Схемы данных калькулятора. Источник истины — YAML в data/, здесь только форма.
import { z } from 'zod';

export const UNKNOWN = '__unknown__' as const;

export const ServiceId = z.enum(['geology', 'topo']);
export type ServiceId = z.infer<typeof ServiceId>;

export const Unit = z.enum(['м', 'п.м', 'м²', 'га', 'км', 'шт', 'проба', 'точка', 'выезд', 'объект', 'служба']);

export const Value = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]);
export type Value = z.infer<typeof Value>;

export const NormRef = z.object({
  code: z.string(),
  // Пункт указываем только после проверки инженером.
  clause: z.string().optional(),
});
export type NormRef = z.infer<typeof NormRef>;

// ── Условия ─────────────────────────────────────────────────────────
export type Condition =
  | { q: string; in: Value[] }
  | { q: string; not_in: Value[] }
  | { q: string; includes: string }
  | { q: string; gt: number }
  | { q: string; lte: number }
  | { all: Condition[] }
  | { any: Condition[] };

export const Condition: z.ZodType<Condition> = z.lazy(() =>
  z.union([
    z.strictObject({ q: z.string(), in: z.array(Value) }),
    z.strictObject({ q: z.string(), not_in: z.array(Value) }),
    z.strictObject({ q: z.string(), includes: z.string() }),
    z.strictObject({ q: z.string(), gt: z.number() }),
    z.strictObject({ q: z.string(), lte: z.number() }),
    z.strictObject({ all: z.array(Condition) }),
    z.strictObject({ any: z.array(Condition) }),
  ]),
);

// ── Выражения ───────────────────────────────────────────────────────
// Белый список операций: правила — это данные, а не код.
export type Expr =
  | number
  | { answer: string }
  | { ref: string }
  | { lookup: { q: string; map: Record<string, number> } }
  | { table: { q: string; rows: Array<{ max: number | null; value: number }> } }
  | { sum: Expr[] }
  | { mul: Expr[] }
  | { div: [Expr, Expr] }
  | { max: Expr[] }
  | { min: Expr[] }
  | { ceil: Expr }
  | { if: Condition; then: Expr; else: Expr };

export const Expr: z.ZodType<Expr> = z.lazy(() =>
  z.union([
    z.number(),
    z.strictObject({ answer: z.string() }),
    z.strictObject({ ref: z.string() }),
    z.strictObject({ lookup: z.strictObject({ q: z.string(), map: z.record(z.string(), z.number()) }) }),
    z.strictObject({
      table: z.strictObject({
        q: z.string(),
        rows: z.array(z.strictObject({ max: z.number().nullable(), value: z.number() })).min(1),
      }),
    }),
    z.strictObject({ sum: z.array(Expr).min(1) }),
    z.strictObject({ mul: z.array(Expr).min(1) }),
    z.strictObject({ div: z.tuple([Expr, Expr]) }),
    z.strictObject({ max: z.array(Expr).min(1) }),
    z.strictObject({ min: z.array(Expr).min(1) }),
    z.strictObject({ ceil: Expr }),
    z.strictObject({ if: Condition, then: Expr, else: Expr }),
  ]),
);

// ── Цены ────────────────────────────────────────────────────────────
export const Rate = z.strictObject({
  id: z.string(),
  service: ServiceId,
  title: z.string(),
  unit: Unit,
  price: z.number().nonnegative(),
  min_charge: z.number().nonnegative().optional(),
  demo: z.boolean(),
  note: z.string().optional(),
});
export type Rate = z.infer<typeof Rate>;

export const Pricing = z.strictObject({
  version: z.string(),
  currency: z.literal('RUB'),
  vat: z.enum(['included', 'excluded', 'none']),
  rounding: z.number().positive(),
  rates: z.array(Rate).min(1),
  travel_zones: z
    .array(
      z.strictObject({
        id: z.string(),
        title: z.string(),
        // null — дальше последней зоны: стоимость выезда по согласованию, цена становится вилкой
        max_km: z.number().positive().nullable(),
        price: z.number().nonnegative().nullable(),
        demo: z.boolean(),
      }),
    )
    .min(1),
  urgency: z
    .array(
      z.strictObject({
        id: z.string(),
        title: z.string(),
        multiplier: z.number().positive(),
        days_factor: z.number().positive(),
        demo: z.boolean(),
      }),
    )
    .min(1),
  bundle_discount: z.strictObject({ percent: z.number().min(0).max(100), demo: z.boolean() }),
  range: z.strictObject({
    // Вилка = расчёт × low … × high. Для коммерческих объектов и выезда «по согласованию».
    low: z.number().positive(),
    high: z.number().positive(),
    demo: z.boolean(),
  }),
});
export type Pricing = z.infer<typeof Pricing>;

// ── Вопросы ─────────────────────────────────────────────────────────
export const Question = z.strictObject({
  id: z.string(),
  service: z.enum(['common', 'geology', 'topo']),
  title: z.string(),
  hint: z.string().optional(),
  why: z.strictObject({ text: z.string(), norm: NormRef.optional() }).optional(),
  kind: z.enum(['choice', 'multi', 'number', 'boolean', 'text']),
  options: z.array(z.strictObject({ value: z.string(), label: z.string(), hint: z.string().optional() })).optional(),
  number: z.strictObject({ unit: Unit, min: z.number(), max: z.number(), step: z.number().positive() }).optional(),
  // Вопрос только для заявки (кадастровый номер): в расчёте не участвует, «не знаю» не нужно.
  lead_only: z.boolean().optional(),
  unknown: z
    .strictObject({
      label: z.string(),
      assume: Value,
      note: z.string(),
      demo: z.boolean(),
    })
    .optional(),
  show_if: Condition.optional(),
});
export type Question = z.infer<typeof Question>;

export const Questions = z.array(Question);

// ── Правила ─────────────────────────────────────────────────────────
export const RateChoice = z.union([z.string(), z.strictObject({ by: z.string(), map: z.record(z.string(), z.string()) })]);

export const Rule = z.strictObject({
  id: z.string(),
  applies_if: Condition.optional(),
  rate: RateChoice,
  qty: Expr,
  basis: z.string(),
  norm: NormRef.optional(),
  verified: z.boolean(),
  demo: z.boolean(),
});
export type Rule = z.infer<typeof Rule>;

export const ServiceRules = z.strictObject({
  service: ServiceId,
  title: z.string(),
  // Именованные величины (число скважин, глубина) — на них ссылаются правила через { ref }.
  quantities: z
    .array(
      z.strictObject({
        id: z.string(),
        title: z.string(),
        unit: Unit,
        expr: Expr,
        basis: z.string(),
        norm: NormRef.optional(),
        verified: z.boolean(),
        demo: z.boolean(),
      }),
    )
    .default([]),
  rules: z.array(Rule).min(1),
  duration_days: z.strictObject({ min: Expr, max: Expr, demo: z.boolean() }),
  checklist: z.array(z.strictObject({ text: z.string(), applies_if: Condition.optional() })).default([]),
});
export type ServiceRules = z.infer<typeof ServiceRules>;

// ── Итог ────────────────────────────────────────────────────────────
export interface CalcData {
  pricing: Pricing;
  questions: Question[];
  services: ServiceRules[];
}

export type Answers = Record<string, Value | typeof UNKNOWN>;

export interface Assumption {
  question: string;
  title: string;
  assumed: Value;
  note: string;
}

export interface QuantityResult {
  id: string;
  service: ServiceId;
  title: string;
  value: number;
  unit: string;
  basis: string;
  norm?: NormRef;
  verified: boolean;
}

export interface ProgramItem {
  rule: string;
  service: ServiceId;
  rate: string;
  title: string;
  qty: number;
  unit: string;
  unit_price: number;
  total: number;
  basis: string;
  norm?: NormRef;
  verified: boolean;
  demo: boolean;
}

export type Price = { kind: 'exact'; total: number } | { kind: 'range'; min: number; max: number };

export interface Program {
  services: ServiceId[];
  answers: Answers;
  assumptions: Assumption[];
  quantities: QuantityResult[];
  items: ProgramItem[];
  subtotal: number;
  bundle_discount?: { percent: number; amount: number };
  travel: { zone: string; title: string; distance_km: number; price: number | null };
  urgency: { id: string; title: string; multiplier: number };
  duration_days: { min: number; max: number };
  price: Price;
  range_reasons: Array<'commercial' | 'travel_by_agreement'>;
  client_checklist: string[];
  pricing_version: string;
  has_demo_values: boolean;
  has_unverified_rules: boolean;
}

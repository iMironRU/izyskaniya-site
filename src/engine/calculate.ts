// Расчёт предварительной программы работ: (данные, ответы) → Program. Без UI и I/O.
import { resolveAnswers } from './answers';
import { DataError, evalCondition, evalExpr, type ExprContext } from './expr';
import type { Answers, CalcData, Pricing, Program, ProgramItem, QuantityResult, ServiceId, ServiceRules } from './schema';

/** Вопросы, от которых зависит сам движок (а не только правила услуг). */
export const SYSTEM_QUESTIONS = {
  services: 'services',
  objectType: 'object_type',
  distance: 'distance_km',
  urgency: 'urgency',
} as const;

/** Значение object_type, при котором цена показывается вилкой. */
export const COMMERCIAL = 'commercial';

export const roundTo = (x: number, step: number) => Math.round(x / step) * step;
const round2 = (x: number) => Math.round(x * 100) / 100;

export function travelZone(pricing: Pricing, km: number) {
  const zone = pricing.travel_zones.find((z) => z.max_km === null || km <= z.max_km);
  if (!zone) throw new DataError(`Нет зоны выезда для ${km} км: последняя зона должна иметь max_km: null`);
  return zone;
}

function serviceItems(svc: ServiceRules, pricing: Pricing, ctx: ExprContext) {
  const quantities: QuantityResult[] = [];
  const demoFlags: boolean[] = [];

  for (const q of svc.quantities) {
    const value = round2(evalExpr(q.expr, ctx));
    ctx.refs[q.id] = value;
    quantities.push({
      id: q.id,
      service: svc.service,
      title: q.title,
      value,
      unit: q.unit,
      basis: q.basis,
      norm: q.norm,
      verified: q.verified,
    });
    demoFlags.push(q.demo);
  }

  const items: ProgramItem[] = [];
  for (const rule of svc.rules) {
    if (rule.applies_if && !evalCondition(rule.applies_if, ctx.answers)) continue;
    const rateId = typeof rule.rate === 'string' ? rule.rate : (rule.rate.map[String(ctx.answers[rule.rate.by])] ?? rule.rate.default);
    const rate = pricing.rates.find((r) => r.id === rateId);
    if (!rate) throw new DataError(`Правило «${rule.id}»: нет тарифа «${rateId}»`);
    const qty = round2(evalExpr(rule.qty, ctx));
    if (qty <= 0) continue;
    const total = Math.round(Math.max(qty * rate.price, rate.min_charge ?? 0));
    items.push({
      rule: rule.id,
      service: svc.service,
      rate: rate.id,
      title: rate.title,
      qty,
      unit: rate.unit,
      unit_price: rate.price,
      total,
      basis: rule.basis,
      norm: rule.norm,
      verified: rule.verified,
      demo: rule.demo || rate.demo,
    });
  }

  const duration = {
    min: Math.ceil(evalExpr(svc.duration_days.min, ctx)),
    max: Math.ceil(evalExpr(svc.duration_days.max, ctx)),
  };
  demoFlags.push(svc.duration_days.demo);

  const checklist = svc.checklist.filter((c) => !c.applies_if || evalCondition(c.applies_if, ctx.answers)).map((c) => c.text);

  return { quantities, items, duration, checklist, demo: demoFlags.some(Boolean) };
}

export function calculate(data: CalcData, raw: Answers): Program {
  const { pricing } = data;
  const { values, assumptions } = resolveAnswers(data.questions, raw);

  // Услуги: ответ на «Что нужно сделать» + добавленные ответом «да» (adds_service).
  const services = [...((values[SYSTEM_QUESTIONS.services] as ServiceId[] | undefined) ?? [])];
  for (const q of data.questions) {
    if (q.adds_service && values[q.id] === true && !services.includes(q.adds_service)) services.push(q.adds_service);
  }
  const ctx: ExprContext = { answers: values, refs: {} };

  const quantities: QuantityResult[] = [];
  const items: ProgramItem[] = [];
  const checklist: string[] = [];
  let durationMin = 0;
  let durationMax = 0;
  let demo = false;

  for (const svc of data.services) {
    if (!services.includes(svc.service)) continue;
    const r = serviceItems(svc, pricing, ctx);
    quantities.push(...r.quantities);
    items.push(...r.items);
    checklist.push(...r.checklist.filter((c) => !checklist.includes(c)));
    // Полевые работы по услугам идут параллельно: срок — по самой долгой.
    durationMin = Math.max(durationMin, r.duration.min);
    durationMax = Math.max(durationMax, r.duration.max);
    demo ||= r.demo;
  }

  const subtotal = items.reduce((s, i) => s + i.total, 0);

  const bothServices = services.includes('geology') && services.includes('topo');
  const bundle =
    bothServices && pricing.bundle_discount.percent > 0
      ? { percent: pricing.bundle_discount.percent, amount: Math.round((subtotal * pricing.bundle_discount.percent) / 100) }
      : undefined;
  if (bundle) demo ||= pricing.bundle_discount.demo;

  const urgency = pricing.urgency.find((u) => u.id === values[SYSTEM_QUESTIONS.urgency]);
  if (!urgency) throw new DataError(`Нет режима срочности «${String(values[SYSTEM_QUESTIONS.urgency])}» в pricing.urgency`);
  demo ||= urgency.demo;

  const distance = values[SYSTEM_QUESTIONS.distance] as number;
  const zone = travelZone(pricing, distance);
  demo ||= zone.demo;

  const works = Math.round((subtotal - (bundle?.amount ?? 0)) * urgency.multiplier);
  const base = works + (zone.price ?? 0);

  const rangeReasons: Program['range_reasons'] = [];
  if (values[SYSTEM_QUESTIONS.objectType] === COMMERCIAL) rangeReasons.push('commercial');
  if (zone.price === null) rangeReasons.push('travel_by_agreement');

  const step = pricing.rounding;
  const price: Program['price'] = rangeReasons.length
    ? { kind: 'range', min: roundTo(base * pricing.range.low, step), max: roundTo(base * pricing.range.high, step) }
    : { kind: 'exact', total: roundTo(base, step) };
  if (rangeReasons.length) demo ||= pricing.range.demo;

  demo ||= items.some((i) => i.demo);
  demo ||= assumptions.length > 0 && data.questions.some((q) => q.unknown?.demo && assumptions.some((a) => a.question === q.id));

  return {
    services,
    answers: raw,
    assumptions,
    quantities,
    items,
    subtotal,
    bundle_discount: bundle,
    travel: { zone: zone.id, title: zone.title, distance_km: distance, price: zone.price },
    urgency: { id: urgency.id, title: urgency.title, multiplier: urgency.multiplier },
    duration_days: {
      min: Math.max(1, Math.ceil(durationMin * urgency.days_factor)),
      max: Math.max(1, Math.ceil(durationMax * urgency.days_factor)),
    },
    price,
    range_reasons: rangeReasons,
    client_checklist: checklist,
    pricing_version: pricing.version,
    has_demo_values: demo,
    has_unverified_rules: items.some((i) => !i.verified) || quantities.some((q) => !q.verified),
  };
}

/** Нижняя граница цены — для «от …» в карточках услуг и на странице «Цены». */
export function priceFrom(data: CalcData, answers: Answers): number {
  const p = calculate(data, answers).price;
  return p.kind === 'exact' ? p.total : p.min;
}

/** Матрица цен (например «пятно × этажность») для страницы «Цены». */
export function priceMatrix(
  data: CalcData,
  base: Answers,
  rows: { q: string; values: Answers[string][] },
  cols: { q: string; values: Answers[string][] },
) {
  return rows.values.map((rv) => cols.values.map((cv) => calculate(data, { ...base, [rows.q]: rv, [cols.q]: cv }).price));
}

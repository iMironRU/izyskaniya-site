// Проверки реальных данных из data/. Точные суммы тут не проверяем — цены будут
// меняться. Проверяем, что каждая ветка каждого вопроса даёт корректный расчёт.
import { describe, expect, it } from 'vitest';
import { resolveAnswers } from './answers';
import { calculate, COMMERCIAL } from './calculate';
import { loadCalcData } from './load';
import { UNKNOWN, type Answers, type Program, type Question } from './schema';

const data = loadCalcData();

/** Типичный частный дом с обеими услугами — база для перебора веток. */
const base: Answers = {
  services: ['geology', 'topo'],
  object_type: 'house',
  distance_km: 20,
  urgency: 'normal',
  length_m: 12,
  floors: '2',
  basement: false,
  foundation: 'strip',
  topo_purpose: 'house',
  topo_geometry: 'area',
  area_ha: 0.12,
  scale: '500',
  utilities: true,
  trees: false,
  stakeout: false,
  approvals: true,
};

function sane(p: Program) {
  expect(p.items.length).toBeGreaterThan(0);
  for (const i of p.items) {
    expect(i.qty, i.rule).toBeGreaterThan(0);
    expect(Number.isFinite(i.total), i.rule).toBe(true);
    expect(i.basis.length, i.rule).toBeGreaterThan(0);
  }
  if (p.price.kind === 'exact') expect(p.price.total).toBeGreaterThan(0);
  else expect(p.price.max).toBeGreaterThan(p.price.min);
  expect(p.duration_days.max).toBeGreaterThanOrEqual(p.duration_days.min);
}

const branchValues = (q: Question): Answers[string][] => {
  switch (q.kind) {
    case 'choice':
      return q.options!.map((o) => o.value);
    case 'multi':
      return q.options!.map((o) => [o.value]);
    case 'boolean':
      return [true, false];
    case 'number':
      return [q.number!.min, q.number!.max];
    case 'text':
      return ['текст'];
  }
};

describe('data/', () => {
  it('загружается и проходит проверки', () => {
    expect(data.questions.length).toBeGreaterThan(0);
  });

  it('базовый сценарий «частный дом» считается точной ценой', () => {
    const p = calculate(data, base);
    sane(p);
    expect(p.price.kind).toBe('exact');
    expect(p.assumptions).toEqual([]);
    expect(p.bundle_discount).toBeDefined();
  });

  const cases = data.questions.flatMap((q) => [
    ...branchValues(q).map((v) => [q.id, JSON.stringify(v), { ...base, [q.id]: v }] as const),
    ...(q.unknown ? [[q.id, 'не знаю', { ...base, [q.id]: UNKNOWN }] as const] : []),
  ]);

  it.each(cases)('%s = %s', (qid, label, answers) => {
    const p = calculate(data, answers);
    sane(p);
    const hidden = !resolveAnswers(data.questions, answers).visible.includes(qid);
    if (label === 'не знаю' && !hidden) expect(p.assumptions.map((a) => a.question)).toContain(qid);
  });

  it('всё «не знаю» — расчёт есть, и все допущения видны', () => {
    const p = calculate(data, {});
    sane(p);
    expect(p.assumptions.length).toBeGreaterThan(5);
  });

  it('коммерческий объект → вилка и чек-лист, без тупика', () => {
    const p = calculate(data, { ...base, object_type: COMMERCIAL });
    expect(p.price.kind).toBe('range');
    expect(p.client_checklist.length).toBeGreaterThan(2);
  });

  it('выезд дальше последней зоны → вилка', () => {
    expect(calculate(data, { ...base, distance_km: 2000 }).price.kind).toBe('range');
  });

  it('больше этажей — не дешевле', () => {
    const at = (floors: string) => calculate(data, { ...base, services: ['geology'], floors }).subtotal;
    expect(at('2')).toBeGreaterThanOrEqual(at('1'));
    expect(at('3')).toBeGreaterThanOrEqual(at('2'));
  });

  it('пока данные демо, результат это показывает', () => {
    expect(calculate(data, base).has_demo_values).toBe(true);
    expect(calculate(data, base).has_unverified_rules).toBe(true);
  });
});

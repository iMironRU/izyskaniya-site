import { describe, expect, it } from 'vitest';
import { mini } from './__fixtures__/mini';
import { AnswerError } from './answers';
import { calculate, priceFrom, priceMatrix } from './calculate';
import { UNKNOWN, type Answers, type Program } from './schema';

const geo: Answers = { services: ['geology'], object_type: 'house', distance_km: 10, urgency: 'normal', floors: '1' };
const topo: Answers = { services: ['topo'], object_type: 'house', distance_km: 10, urgency: 'normal', area_ha: 0.5, scale: '500' };
const both: Answers = { ...geo, ...topo, services: ['geology', 'topo'] };

describe('calculate: суммы', () => {
  it.each<[string, Answers, Program['price']]>([
    // 3 скв × 5 м × 1000 + отчёт 10 000
    ['геология, 1 этаж', geo, { kind: 'exact', total: 25000 }],
    // 3 × 10 × 1000 + 10 000
    ['геология, 2 этажа', { ...geo, floors: '2' }, { kind: 'exact', total: 40000 }],
    // 0,5 га × 20 000
    ['топо 1:500', topo, { kind: 'exact', total: 10000 }],
    // 0,1 га × 20 000 = 2 000 < минимума 5 000
    ['топо: минимальная стоимость', { ...topo, area_ha: 0.1 }, { kind: 'exact', total: 5000 }],
    // тариф выбирается по масштабу: 0,5 × 10 000
    ['топо 1:2000', { ...topo, scale: '2000' }, { kind: 'exact', total: 5000 }],
    // (25 000 + 10 000) − 10 % = 31 500
    ['пакет со скидкой', both, { kind: 'exact', total: 31500 }],
    // + выезд 5 000
    ['выезд 2-й зоны', { ...geo, distance_km: 80 }, { kind: 'exact', total: 30000 }],
    // граница зоны включительно
    ['ровно на границе зоны', { ...geo, distance_km: 50 }, { kind: 'exact', total: 25000 }],
    // 25 000 × 1,5
    ['срочно', { ...geo, urgency: 'urgent' }, { kind: 'exact', total: 37500 }],
    // вилка 0,9–1,5 от 25 000
    ['коммерческий → вилка', { ...geo, object_type: 'commercial' }, { kind: 'range', min: 22500, max: 37500 }],
    // выезд по согласованию → вилка от стоимости без выезда
    ['дальний выезд → вилка', { ...geo, distance_km: 300 }, { kind: 'range', min: 22500, max: 37500 }],
  ])('%s', (_, answers, price) => {
    expect(calculate(mini, answers).price).toEqual(price);
  });

  it('итог округляется до шага из pricing.rounding', () => {
    // (25 000 + 0,31 × 20 000) − 10 % = 28 080 → 28 100
    expect(calculate(mini, { ...both, area_ha: 0.31 }).price).toEqual({ kind: 'exact', total: 28100 });
  });

  it('объём округляется до сотых до умножения на цену', () => {
    // 0,337 га → 0,34 × 20 000 = 6 800
    expect(calculate(mini, { ...topo, area_ha: 0.337 }).items[0].qty).toBe(0.34);
  });
});

describe('calculate: состав результата', () => {
  it('позиции несут обоснование и флаг проверки', () => {
    const p = calculate(mini, geo);
    expect(p.items.map((i) => [i.rule, i.qty, i.total, i.verified])).toEqual([
      ['drill', 15, 15000, false],
      ['report', 1, 10000, true],
    ]);
    expect(p.items[0].basis).toBe('бурение');
    expect(p.has_unverified_rules).toBe(true);
  });

  it('величины видны в результате', () => {
    expect(calculate(mini, geo).quantities.map((q) => [q.id, q.value])).toEqual([
      ['depth', 5],
      ['drill_m', 15],
    ]);
  });

  it('скидка пакета показывается отдельно и только при двух услугах', () => {
    expect(calculate(mini, both).bundle_discount).toEqual({ percent: 10, amount: 3500 });
    expect(calculate(mini, geo).bundle_discount).toBeUndefined();
  });

  it('срок: услуги параллельно, срочность сокращает', () => {
    expect(calculate(mini, both).duration_days).toEqual({ min: 10, max: 30 });
    expect(calculate(mini, { ...geo, urgency: 'urgent' }).duration_days).toEqual({ min: 5, max: 10 });
  });

  it('чек-лист без повторов и с условиями', () => {
    expect(calculate(mini, both).client_checklist).toEqual(['Адрес', 'ЕГРН']);
    expect(calculate(mini, { ...geo, object_type: 'commercial' }).client_checklist).toEqual(['Адрес', 'ТЗ']);
  });

  it('причины вилки перечислены', () => {
    expect(calculate(mini, { ...geo, object_type: 'commercial', distance_km: 300 }).range_reasons).toEqual([
      'commercial',
      'travel_by_agreement',
    ]);
  });

  it('версия цен попадает в результат', () => {
    expect(calculate(mini, geo).pricing_version).toBe('test-1');
  });
});

describe('«не знаю»', () => {
  it('подставляет допущение и явно его помечает', () => {
    const p = calculate(mini, { ...geo, floors: UNKNOWN });
    expect(p.assumptions).toEqual([{ question: 'floors', title: 'Этажи', assumed: '2', note: '2 этажа' }]);
    expect(p.price).toEqual({ kind: 'exact', total: 40000 });
  });

  it('пропущенный ответ = «не знаю»', () => {
    const rest = { ...geo };
    delete rest.floors;
    expect(calculate(mini, rest).assumptions.map((a) => a.question)).toEqual(['floors']);
  });

  it('всё «не знаю» — расчёт всё равно есть', () => {
    const p = calculate(mini, {});
    expect(p.services).toEqual(['geology', 'topo']);
    expect(p.assumptions.map((a) => a.question)).toEqual(['services', 'object_type', 'distance_km', 'urgency', 'floors', 'area_ha', 'scale']);
    expect(p.price.kind).toBe('exact');
  });

  it('демо-допущение поднимает флаг demo', () => {
    expect(calculate(mini, geo).has_demo_values).toBe(false);
    expect(calculate(mini, { ...geo, distance_km: UNKNOWN }).has_demo_values).toBe(true);
  });

  it('скрытые вопросы не спрашиваются и не становятся допущениями', () => {
    expect(calculate(mini, geo).assumptions).toEqual([]);
  });
});

describe('ошибки ввода', () => {
  it.each<[string, Answers]>([
    ['нет такого варианта', { ...geo, floors: '9' }],
    ['число вне диапазона', { ...geo, distance_km: -1 }],
    ['не число', { ...geo, distance_km: 'далеко' }],
    ['пустой список услуг', { ...geo, services: [] }],
  ])('%s', (_, answers) => {
    expect(() => calculate(mini, answers)).toThrow(AnswerError);
  });

  it('кадастровый номер в расчёт не попадает', () => {
    const p = calculate(mini, { ...geo, cadastral: '56:44:0000000:1' });
    expect(p.price).toEqual(calculate(mini, geo).price);
    expect(p.answers.cadastral).toBe('56:44:0000000:1');
  });
});

describe('цены «от …» и матрица', () => {
  it('priceFrom берёт нижнюю границу', () => {
    expect(priceFrom(mini, geo)).toBe(25000);
    expect(priceFrom(mini, { ...geo, object_type: 'commercial' })).toBe(22500);
  });

  it('priceMatrix считает тем же движком', () => {
    const m = priceMatrix(mini, geo, { q: 'floors', values: ['1', '2'] }, { q: 'urgency', values: ['normal', 'urgent'] });
    expect(m).toEqual([
      [
        { kind: 'exact', total: 25000 },
        { kind: 'exact', total: 37500 },
      ],
      [
        { kind: 'exact', total: 40000 },
        { kind: 'exact', total: 60000 },
      ],
    ]);
  });
});

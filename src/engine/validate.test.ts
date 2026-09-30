import { describe, expect, it } from 'vitest';
import { mini } from './__fixtures__/mini';
import type { CalcData } from './schema';
import { crossCheck } from './validate';

const clone = (): CalcData => structuredClone(mini);

describe('crossCheck', () => {
  it('фикстура чистая', () => {
    expect(crossCheck(mini)).toEqual([]);
  });

  it.each<[string, (d: CalcData) => void, RegExp]>([
    ['вопрос без «не знаю»', (d) => delete d.questions[5].unknown, /floors.*не знаю/],
    ['допущение не из вариантов', (d) => (d.questions[5].unknown!.assume = '7'), /floors.*допущение/],
    ['нет системного вопроса', (d) => (d.questions = d.questions.filter((q) => q.id !== 'urgency')), /urgency/],
    ['тариф не существует', (d) => (d.services[0].rules[1].rate = 'nope'), /нет тарифа «nope»/],
    ['тариф другой услуги', (d) => (d.services[0].rules[1].rate = 't.500'), /из другой услуги/],
    ['тариф по масштабу не покрывает вариант', (d) => ((d.services[1].rules[0].rate as { map: Record<string, string> }).map = { '500': 't.500' }), /scale=2000/],
    [
      'lookup не покрывает вариант',
      (d) => (d.services[0].quantities[0].expr = { lookup: { q: 'floors', map: { '1': 5 } } }),
      /не покрывает вариант «2»/,
    ],
    ['ссылка на несуществующий вопрос', (d) => (d.services[1].rules[0].qty = { answer: 'nope' }), /вопрос «nope»/],
    ['ссылка на величину до определения', (d) => d.services[0].quantities.reverse(), /до её определения/],
    ['последняя зона без null', (d) => (d.pricing.travel_zones[2].max_km = 500), /max_km: null/],
    ['зоны не по возрастанию', (d) => (d.pricing.travel_zones[1].max_km = 10), /по возрастанию/],
    ['режим срочности без цены', (d) => (d.pricing.urgency = d.pricing.urgency.slice(0, 1)), /urgent/],
    ['дубль тарифа', (d) => d.pricing.rates.push({ ...d.pricing.rates[0] }), /дважды/],
  ])('%s', (_, mutate, message) => {
    const d = clone();
    mutate(d);
    expect(crossCheck(d).join('\n')).toMatch(message);
  });
});

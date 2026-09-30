import { describe, expect, it } from 'vitest';
import { loadCalcData } from '@/engine/load';
import { computePrices, fillDeep, fillText, type PriceProfiles } from './prices';
import { loadPriceProfiles } from './load';

const data = loadCalcData();
const prices = computePrices(data, loadPriceProfiles());
const n = (s: string) => s.replace(/ /g, ' ');

describe('цены для текстов сайта', () => {
  it('все профили считаются', () => {
    for (const [k, p] of Object.entries(prices)) if (k !== "__vars") expect((p as { from: number }).from).toBeGreaterThan(0);
  });

  it('метки подставляются', () => {
    expect(n(fillText('Геология — {{от:geo_dom}}', prices))).toMatch(/^Геология — от [\d ]+ ₽$/);
    expect(n(fillText('{{срок:pkg_dom150}}', prices))).toMatch(/^\d+(–\d+)? (день|дня|дней)$/);
    expect(n(fillText('{{от:cpt}}', prices))).toMatch(/\/точка$/);
  });

  it('неизвестный профиль — ошибка', () => {
    expect(() => fillText('{{от:nope}}', prices)).toThrow(/nope/);
  });

  it('подстановка в глубину', () => {
    expect(fillDeep({ a: ['{{цена:geo_dom}}'] }, prices).a[0]).not.toContain('{{');
  });

  it('одна правка цены меняет тексты сайта', () => {
    const cheaper = structuredClone(data);
    cheaper.pricing.rates.find((r) => r.id === 'geo.drilling')!.price /= 2;
    const p2 = computePrices(cheaper, loadPriceProfiles() as PriceProfiles);
    expect(p2.geo_dom.from).toBeLessThan(prices.geo_dom.from);
  });
});

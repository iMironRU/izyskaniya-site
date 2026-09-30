import { describe, expect, it } from 'vitest';
import { UNKNOWN } from './schema';
import { decodeShare, encodeShare } from './share';

describe('share', () => {
  it('ответы переживают кодирование, включая кириллицу и «не знаю»', () => {
    const answers = { services: ['geology'], length_m: 12.5, basement: false, floors: UNKNOWN, cadastral: 'участок №1' };
    const s = encodeShare(answers, 'v-1');
    expect(s).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodeShare(s)).toEqual({ answers, pricingVersion: 'v-1' });
  });

  it.each(['', 'мусор', '!!!', encodeShare({}, 'x').slice(0, 5), btoa('{"v":2,"p":"x","a":{}}')])('битая ссылка → null: %s', (s) => {
    expect(decodeShare(s)).toBeNull();
  });
});

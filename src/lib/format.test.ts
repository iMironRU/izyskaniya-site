import { describe, expect, it } from 'vitest';
import { formatCadastral, formatMoney, formatNumber, formatPhone, isValidCadastral, isValidPhone, parseDecimal } from './format';

const n = (s: string) => s.replace(/ /g, ' ');

describe('деньги и числа', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1000, '1 000'],
    [117800, '117 800'],
    [1234567, '1 234 567'],
    [12.5, '12,5'],
    [0.25, '0,25'],
    [-1500, '−1 500'],
  ])('%s → %s', (x, s) => expect(n(formatNumber(x))).toBe(s));

  it('рубли с неразрывным пробелом', () => expect(formatMoney(25000)).toBe('25 000 ₽'));

  it.each<[string, number | null]>([
    ['12', 12],
    ['12,5', 12.5],
    ['12.5', 12.5],
    ['12 500', 12500],
    [',5', 0.5],
    ['', null],
    ['abc', null],
    ['1,2,3', null],
  ])('parseDecimal(%s) → %s', (s, v) => expect(parseDecimal(s)).toBe(v));
});

describe('телефон', () => {
  it.each([
    ['', ''],
    ['8', '+7'],
    ['+7', '+7'],
    ['9', '+7 (9'],
    ['999', '+7 (999)'],
    ['9991', '+7 (999) 1'],
    ['9991234567', '+7 (999) 123-45-67'],
    ['89991234567', '+7 (999) 123-45-67'],
    ['+7 999 123 45 67', '+7 (999) 123-45-67'],
    ['+7 (999) 123-45-678', '+7 (999) 123-45-67'],
  ])('%s → %s', (i, o) => expect(formatPhone(i)).toBe(o));

  it('полный номер валиден, неполный — нет', () => {
    expect(isValidPhone('+7 (999) 123-45-67')).toBe(true);
    expect(isValidPhone('+7 (999) 123')).toBe(false);
  });
});

describe('кадастровый номер', () => {
  it.each([
    ['56', '56'],
    ['5644', '56:44'],
    ['56440301001', '56:44:0301001'],
    ['56440301001123', '56:44:0301001:123'],
    ['56:44:301001:12', '56:44:301001:12'],
    ['56:44:ab301001:12:99', '56:44:301001:12'],
  ])('%s → %s', (i, o) => expect(formatCadastral(i)).toBe(o));

  it.each([
    ['56:44:0301001:123', true],
    ['56:44:301001:12', true],
    ['56:44:0301001', false],
    ['5:44:0301001:1', false],
  ])('валидность %s → %s', (s, v) => expect(isValidCadastral(s)).toBe(v));
});

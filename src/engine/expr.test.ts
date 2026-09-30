import { describe, expect, it } from 'vitest';
import { DataError, evalCondition, evalExpr } from './expr';
import type { Condition, Expr } from './schema';

const answers = { n: 12, b: true, c: 'x', m: ['a', 'b'] };
const ctx = { answers, refs: { r: 4 } };

describe('evalExpr', () => {
  it.each<[string, Expr, number]>([
    ['число', 7, 7],
    ['ответ', { answer: 'n' }, 12],
    ['да/нет как 1/0', { answer: 'b' }, 1],
    ['ссылка', { ref: 'r' }, 4],
    ['lookup', { lookup: { q: 'c', map: { x: 3, y: 5 } } }, 3],
    ['table: попадание в строку', { table: { q: 'n', rows: [{ max: 10, value: 1 }, { max: 20, value: 2 }, { max: null, value: 3 }] } }, 2],
    ['table: граница включительно', { table: { q: 'n', rows: [{ max: 12, value: 1 }, { max: null, value: 2 }] } }, 1],
    ['table: хвост null', { table: { q: 'n', rows: [{ max: 5, value: 1 }, { max: null, value: 9 }] } }, 9],
    ['sum', { sum: [1, 2, { ref: 'r' }] }, 7],
    ['mul', { mul: [2, { answer: 'n' }] }, 24],
    ['div', { div: [{ answer: 'n' }, 5] }, 2.4],
    ['max', { max: [1, { ref: 'r' }] }, 4],
    ['min', { min: [1, { ref: 'r' }] }, 1],
    ['ceil', { ceil: { div: [{ answer: 'n' }, 5] } }, 3],
    ['ceil без ошибки округления', { ceil: { mul: [0.1, 30] } }, 3],
    ['if да', { if: { q: 'c', in: ['x'] }, then: 1, else: 2 }, 1],
    ['if нет', { if: { q: 'c', in: ['y'] }, then: 1, else: 2 }, 2],
  ])('%s', (_, e, v) => {
    expect(evalExpr(e, ctx)).toBeCloseTo(v);
  });

  it.each<[string, Expr]>([
    ['нет ссылки', { ref: 'zzz' }],
    ['lookup без ключа', { lookup: { q: 'c', map: { y: 1 } } }],
    ['ответ не число', { answer: 'c' }],
    ['table без хвоста', { table: { q: 'n', rows: [{ max: 5, value: 1 }] } }],
    ['деление на ноль', { div: [1, 0] }],
  ])('ошибка данных: %s', (_, e) => {
    expect(() => evalExpr(e, ctx)).toThrow(DataError);
  });
});

describe('evalCondition', () => {
  it.each<[string, Condition, boolean]>([
    ['in', { q: 'c', in: ['x', 'z'] }, true],
    ['in с boolean', { q: 'b', in: [true] }, true],
    ['not_in', { q: 'c', not_in: ['x'] }, false],
    ['includes', { q: 'm', includes: 'b' }, true],
    ['gt', { q: 'n', gt: 12 }, false],
    ['lte', { q: 'n', lte: 12 }, true],
    ['all', { all: [{ q: 'c', in: ['x'] }, { q: 'n', gt: 1 }] }, true],
    ['any', { any: [{ q: 'c', in: ['y'] }, { q: 'n', gt: 100 }] }, false],
    ['нет ответа: in → false', { q: 'missing', in: ['x'] }, false],
    ['нет ответа: not_in → true', { q: 'missing', not_in: ['x'] }, true],
    ['нет ответа: includes → false', { q: 'missing', includes: 'x' }, false],
  ])('%s', (_, c, v) => {
    expect(evalCondition(c, answers)).toBe(v);
  });
});

import { describe, expect, it } from 'vitest';
import { mini } from '@/engine/__fixtures__/mini';
import { UNKNOWN } from '@/engine/schema';
import { fromDraft, pruneAnswers, toDraft, toggleMulti, visibleQuestions } from './quiz';

const q = (id: string) => mini.questions.find((x) => x.id === id)!;

describe('видимые шаги', () => {
  it('без ответов — все вопросы (услуги по умолчанию обе)', () => {
    expect(visibleQuestions(mini.questions, {}).map((x) => x.id)).toEqual([
      'services', 'object_type', 'distance_km', 'cadastral', 'urgency', 'floors', 'area_ha', 'scale',
    ]);
  });
  it('только топо — геология скрыта', () => {
    expect(visibleQuestions(mini.questions, { services: ['topo'] }).map((x) => x.id)).not.toContain('floors');
  });
  it('скрытые ответы вычищаются', () => {
    expect(pruneAnswers(mini.questions, { services: ['topo'], floors: '2', area_ha: 1 })).toEqual({ services: ['topo'], area_ha: 1 });
  });
});

describe('черновик ↔ ответ', () => {
  it.each([
    ['choice', 'floors', '2', '2'],
    ['multi', 'services', ['geology'], ['geology']],
    ['number с запятой', 'area_ha', '0,25', 0.25],
    ['не знаю', 'floors', UNKNOWN, UNKNOWN],
    ['не знаю в multi', 'services', [UNKNOWN], UNKNOWN],
  ] as const)('%s', (_, id, draft, value) => {
    expect(fromDraft(q(id), draft as never)).toEqual({ ok: true, value });
  });

  it.each([
    ['пусто', 'floors', null, /Выберите/],
    ['не число', 'area_ha', 'много', /число/],
    ['вне диапазона', 'area_ha', '1000', /до 100/],
  ] as const)('ошибка: %s', (_, id, draft, msg) => {
    const r = fromDraft(q(id), draft);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(msg);
  });

  it('необязательный вопрос можно пропустить', () => {
    expect(fromDraft(q('cadastral'), '')).toEqual({ ok: true, value: undefined });
  });

  it('обратное преобразование', () => {
    expect(toDraft(q('area_ha'), 0.25)).toBe('0,25');
    expect(toDraft(q('services'), UNKNOWN)).toEqual([UNKNOWN]);
    expect(toDraft(q('floors'), undefined)).toBeNull();
  });
});

describe('мультивыбор с «не знаю»', () => {
  it('«не знаю» снимает остальные', () => expect(toggleMulti(['geology'], ['geology', UNKNOWN])).toEqual([UNKNOWN]));
  it('вариант снимает «не знаю»', () => expect(toggleMulti([UNKNOWN], [UNKNOWN, 'topo'])).toEqual(['topo']));
});

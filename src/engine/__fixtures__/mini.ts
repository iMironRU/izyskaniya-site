// Маленький набор данных с круглыми числами — для тестов движка на точные суммы.
// Не зависит от data/: реальные цены можно менять, не трогая эти тесты.
import type { CalcData } from '../schema';

export const mini: CalcData = {
  pricing: {
    version: 'test-1',
    currency: 'RUB',
    vat: 'none',
    rounding: 100,
    rates: [
      { id: 'g.drill', service: 'geology', title: 'Бурение', unit: 'п.м', price: 1000, demo: false },
      { id: 'g.report', service: 'geology', title: 'Отчёт', unit: 'объект', price: 10000, demo: false },
      { id: 't.500', service: 'topo', title: 'Съёмка 1:500', unit: 'га', price: 20000, min_charge: 5000, demo: false },
      { id: 't.2000', service: 'topo', title: 'Съёмка 1:2000', unit: 'га', price: 10000, demo: false },
    ],
    travel_zones: [
      { id: 'near', title: 'до 50 км', max_km: 50, price: 0, demo: false },
      { id: 'mid', title: 'до 100 км', max_km: 100, price: 5000, demo: false },
      { id: 'far', title: 'дальше', max_km: null, price: null, demo: false },
    ],
    urgency: [
      { id: 'normal', title: 'Обычно', multiplier: 1, days_factor: 1, demo: false },
      { id: 'urgent', title: 'Срочно', multiplier: 1.5, days_factor: 0.5, demo: false },
    ],
    bundle_discount: { percent: 10, demo: false },
    range: { low: 0.9, high: 1.5, demo: false },
  },
  questions: [
    {
      id: 'services',
      service: 'common',
      title: 'Услуги',
      kind: 'multi',
      options: [
        { value: 'geology', label: 'Геология' },
        { value: 'topo', label: 'Топо' },
      ],
      unknown: { label: 'Не знаю', assume: ['geology', 'topo'], note: 'оба', demo: false },
    },
    {
      id: 'object_type',
      service: 'common',
      title: 'Объект',
      kind: 'choice',
      options: [
        { value: 'house', label: 'Дом' },
        { value: 'commercial', label: 'Коммерческий' },
      ],
      unknown: { label: 'Не знаю', assume: 'house', note: 'дом', demo: false },
    },
    {
      id: 'distance_km',
      service: 'common',
      title: 'Расстояние',
      kind: 'number',
      number: { unit: 'км', min: 0, max: 1000, step: 1 },
      unknown: { label: 'Не знаю', assume: 80, note: '80 км', demo: true },
    },
    { id: 'cadastral', service: 'common', title: 'Кадастр', kind: 'text', lead_only: true },
    {
      id: 'urgency',
      service: 'common',
      title: 'Срочность',
      kind: 'choice',
      options: [
        { value: 'normal', label: 'Обычно' },
        { value: 'urgent', label: 'Срочно' },
      ],
      unknown: { label: 'Не важно', assume: 'normal', note: 'обычно', demo: false },
    },
    {
      id: 'floors',
      service: 'geology',
      title: 'Этажи',
      kind: 'choice',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
      ],
      show_if: { q: 'services', includes: 'geology' },
      unknown: { label: 'Не знаю', assume: '2', note: '2 этажа', demo: false },
    },
    {
      id: 'area_ha',
      service: 'topo',
      title: 'Площадь',
      kind: 'number',
      number: { unit: 'га', min: 0.01, max: 100, step: 0.01 },
      show_if: { q: 'services', includes: 'topo' },
      unknown: { label: 'Не знаю', assume: 0.5, note: '0,5 га', demo: false },
    },
    {
      id: 'scale',
      service: 'topo',
      title: 'Масштаб',
      kind: 'choice',
      options: [
        { value: '500', label: '1:500' },
        { value: '2000', label: '1:2000' },
      ],
      show_if: { q: 'services', includes: 'topo' },
      unknown: { label: 'Не знаю', assume: '500', note: '1:500', demo: false },
    },
  ],
  services: [
    {
      service: 'geology',
      title: 'Геология',
      quantities: [
        {
          id: 'depth',
          title: 'Глубина',
          unit: 'м',
          expr: { lookup: { q: 'floors', map: { '1': 5, '2': 10 } } },
          basis: 'по этажности',
          verified: false,
          demo: false,
        },
        {
          id: 'drill_m',
          title: 'Бурение',
          unit: 'п.м',
          expr: { mul: [3, { ref: 'depth' }] },
          basis: '3 скважины',
          verified: true,
          demo: false,
        },
      ],
      rules: [
        { id: 'drill', rate: 'g.drill', qty: { ref: 'drill_m' }, basis: 'бурение', verified: false, demo: false },
        { id: 'report', rate: 'g.report', qty: 1, basis: 'отчёт', verified: true, demo: false },
      ],
      duration_days: { min: 10, max: { sum: [15, { ref: 'depth' }] }, demo: false },
      checklist: [{ text: 'Адрес' }, { text: 'ТЗ', applies_if: { q: 'object_type', in: ['commercial'] } }],
    },
    {
      service: 'topo',
      title: 'Топо',
      quantities: [],
      rules: [
        {
          id: 'survey',
          rate: { by: 'scale', map: { '500': 't.500', '2000': 't.2000' } },
          qty: { answer: 'area_ha' },
          basis: 'съёмка',
          verified: true,
          demo: false,
        },
      ],
      duration_days: { min: 5, max: 30, demo: false },
      checklist: [{ text: 'Адрес' }, { text: 'ЕГРН' }],
    },
  ],
};

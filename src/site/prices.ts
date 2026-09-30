// Цены для текстов сайта: профили data/site/prices.yaml → «от 38 000 ₽», «49 000 ₽», «8 дней».
// Считаются тем же движком, что калькулятор. Выполняется на сборке (серверные компоненты).
import { z } from 'zod';
import { calculate } from '@/engine/calculate';
import { Value, type CalcData } from '@/engine/schema';
import { formatMoney } from '@/lib/format';

export const PriceProfiles = z.record(
  z.string(),
  z.union([
    z.strictObject({ preset: z.string(), answers: z.record(z.string(), Value) }),
    z.strictObject({ catalog: z.string() }),
    z.strictObject({ rate: z.string() }),
  ]),
);
export type PriceProfiles = z.infer<typeof PriceProfiles>;

export interface PriceInfo {
  /** Нижняя граница (для «от …») */
  from: number;
  /** Точная цена расчёта (для пакетов); у вилки — нижняя граница */
  exact: number;
  unit?: string;
  days?: { min: number; max: number };
}

export type Prices = Record<string, PriceInfo> & { __vars?: Record<string, string> };

/** Переменные модели цен для текстов: {{v:bundle}} → «10 %». */
function priceVars(data: CalcData): Record<string, string> {
  const p = data.pricing;
  const fast = p.urgency.find((u) => u.id === 'fast');
  const free = p.travel_zones.find((z) => z.price === 0);
  return {
    bundle: `${p.bundle_discount.percent}\u00A0%`,
    urgent: fast ? `+${Math.round((fast.multiplier - 1) * 100)}\u00A0%` : '',
    free_km: free?.max_km ? `${free.max_km}\u00A0км` : '',
    vat: p.vat === 'none' ? 'без НДС' : p.vat === 'included' ? 'с НДС' : 'НДС сверху',
  };
}

export function computePrices(data: CalcData, profiles: PriceProfiles): Prices {
  const out: Prices = { __vars: priceVars(data) } as Prices;
  for (const [key, p] of Object.entries(profiles)) {
    if (key === '__vars') continue;
    if ('preset' in p) {
      const preset = data.presets?.[p.preset];
      if (!preset) throw new Error(`prices.yaml «${key}»: нет сценария «${p.preset}»`);
      const r = calculate(data, { ...preset.answers, ...p.answers });
      const from = r.price.kind === 'exact' ? r.price.total : r.price.min;
      out[key] = { from, exact: from, days: r.duration_days };
    } else if ('catalog' in p) {
      const c = data.pricing.catalog.find((x) => x.id === p.catalog);
      if (!c) throw new Error(`prices.yaml «${key}»: нет строки каталога «${p.catalog}»`);
      out[key] = { from: c.from, exact: c.from, unit: c.unit, days: c.days ? { min: c.days, max: c.days } : undefined };
    } else {
      const rate = data.pricing.rates.find((x) => x.id === p.rate);
      if (!rate) throw new Error(`prices.yaml «${key}»: нет тарифа «${p.rate}»`);
      out[key] = { from: rate.price, exact: rate.price, unit: rate.unit };
    }
  }
  return out;
}

const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

export const daysText = (d: { min: number; max: number }) =>
  d.min === d.max ? `${d.min} ${plural(d.min, 'день', 'дня', 'дней')}` : `${d.min}–${d.max} ${plural(d.max, 'день', 'дня', 'дней')}`;

export function priceText(kind: 'от' | 'цена' | 'срок' | 'дни', p: PriceInfo): string {
  const unit = p.unit ? `/${p.unit}` : '';
  if (kind === 'от') return `от ${formatMoney(p.from)}${unit}`;
  if (kind === 'цена') return `${formatMoney(p.exact)}${unit}`;
  if (!p.days) return '';
  return kind === 'дни' ? `от ${p.days.min} ${plural(p.days.min, 'дня', 'дней', 'дней')}` : daysText(p.days);
}

const TOKEN = /\{\{(от|цена|срок|дни|v):([\w-]+)\}\}/g;

/** Подставляет цены в текст. Неизвестный профиль — ошибка сборки, а не «пустая» цена на сайте. */
export function fillText(s: string, prices: Prices): string {
  return s.replace(TOKEN, (_, kind: 'от' | 'цена' | 'срок' | 'дни' | 'v', key: string) => {
    if (kind === 'v') {
      const v = prices.__vars?.[key];
      if (v === undefined) throw new Error(`Нет переменной цены «${key}»`);
      return v;
    }
    const p = prices[key];
    if (!p) throw new Error(`Нет профиля цены «${key}» (data/site/prices.yaml)`);
    return priceText(kind, p);
  });
}

/** Рекурсивно подставляет цены во все строки объекта контента. */
export function fillDeep<T>(v: T, prices: Prices): T {
  if (typeof v === 'string') return fillText(v, prices) as T;
  if (Array.isArray(v)) return v.map((x) => fillDeep(x, prices)) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fillDeep(x, prices)])) as T;
  return v;
}

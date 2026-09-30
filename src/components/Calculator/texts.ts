import type { Program } from '@/engine/schema';

export const rangeReasonText: Record<Program['range_reasons'][number], string> = {
  commercial: 'Для коммерческого объекта точную цену назовём после технического задания проектировщика.',
  travel_by_agreement: 'Стоимость выезда на такое расстояние согласуем отдельно.',
};

/** Номер программы работ для шапки результата и PDF: стабилен для одних и тех же ответов. */
export function programNumber(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `П-${String(h % 10000).padStart(4, '0')}`;
}

export const serviceShort = { geology: 'Геология', topo: 'Топосъёмка' } as const;

import type { Program } from '@/engine/schema';

export const rangeReasonText: Record<Program['range_reasons'][number], string> = {
  commercial: 'Для коммерческого объекта точную цену назовём после технического задания проектировщика.',
  travel_by_agreement: 'Стоимость выезда на такое расстояние согласуем отдельно.',
};

export const sectionTitle = { common: 'Об объекте', geology: 'Геология', topo: 'Топосъёмка' } as const;

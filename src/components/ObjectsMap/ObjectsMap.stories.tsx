import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ObjectsMap, type MapObject } from './ObjectsMap';

// Демо-объекты (заглушки). На сайте — data/site/objects.yaml.
const items: MapObject[] = [
  { id: 'a', title: 'Дом 10 × 12 м на склоне', kind: 'Частный дом', place: '[район]', lat: 56.9, lng: 60.8, count: 48, figure: 'сэкономили [сумма]' },
  { id: 'b', title: 'Жилой комплекс, 17 этажей', kind: 'МКД', place: '[город]', lat: 56.83, lng: 60.6, count: 310, figure: 'экспертиза с 1-го раза' },
  { id: 'c', title: 'Трасса газопровода 6,4 км', kind: 'Сети', place: '[район]', lat: 56.6, lng: 60.9, count: 12, figure: 'отклонение 0,39 м' },
  { id: 'd', title: 'Склад 60 × 36 м', kind: 'Коммерческий', place: '[район]', lat: 57.1, lng: 61.2, count: 5 },
];

const meta = { title: 'Components/ObjectsMap', component: ObjectsMap } satisfies Meta<typeof ObjectsMap>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { items, kinds: ['Частный дом', 'МКД', 'Сети', 'Коммерческий'] } };
export const Compact: Story = { args: { items, compact: true } };

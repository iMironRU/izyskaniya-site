import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FaqAccordion } from './FaqAccordion';

// Демо-вопросы из хендоффа.
const items = [
  { q: 'Обязательна ли геология для частного дома?', a: 'Для ИЖС формально нет, но без неё фундамент подбирают «на глаз». Исправить осадку дома стоит в десятки раз дороже изысканий.', group: 'Частным' },
  { q: 'Сколько стоят изыскания под дом?', a: 'Цену считает калькулятор по размерам дома и участку.', group: 'Цены' },
  { q: 'Пройдёт ли отчёт экспертизу?', a: 'Отчёты готовим по СП 47.13330 и СП 446.1325800.', group: 'Проектировщикам' },
  { q: 'Работаете ли зимой?', a: 'Да, бурим круглый год.', group: 'Частным' },
];

const meta = { title: 'Components/FaqAccordion', component: FaqAccordion } satisfies Meta<typeof FaqAccordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { items } };
export const AllClosed: Story = { args: { items, defaultOpen: null } };
export const WithSearchAndGroups: Story = { args: { items, search: true, groups: ['Частным', 'Проектировщикам', 'Цены'] } };
export const Hover: Story = { args: { items, defaultOpen: null }, parameters: { pseudo: { hover: ['button'] } } };

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Faq } from './Faq';

// Тексты — примеры для витрины. На сайте FAQ приходит из data/services.
const items = [
  { question: 'Зачем геология для частного дома?', answer: 'Чтобы проектировщик выбрал фундамент по реальным грунтам, а не с запасом «на всякий случай».' },
  { question: 'Сколько длятся изыскания?', answer: 'Срок считает калькулятор по объёму работ.' },
  { question: 'Можно ли без топосъёмки?', answer: 'Для проекта дома и подключения сетей обычно нужна и топосъёмка.' },
];

const meta = { title: 'Components/Faq', component: Faq } satisfies Meta<typeof Faq>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = { args: { items } };
export const Open: Story = { args: { items: items.map((it, i) => ({ ...it, open: i === 0 })) } };

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Timeline } from './Timeline';

// Тексты — демо из хендоффа. На сайте — из data/.
const meta = { title: 'Components/Timeline', component: Timeline } satisfies Meta<typeof Timeline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const HowItWorks: Story = {
  args: {
    rule: 'strong',
    items: [
      { title: 'Заявка и расчёт', term: '15 минут', text: 'Калькулятор на сайте или звонок инженеру. Цена фиксируется в договоре.' },
      { title: 'Договор и выезд', term: '1–3 дня', text: 'Приезжаем со своей буровой установкой и геодезическим оборудованием.' },
      { title: 'Лаборатория', term: '3–5 дней', text: 'Испытываем пробы грунта и воды в собственной аттестованной лаборатории.' },
      { title: 'Отчёт', term: '2 дня', text: 'Технический отчёт в бумаге и PDF с рекомендациями по фундаменту.' },
    ],
  },
};
export const Stages: Story = {
  args: {
    items: [
      { title: 'Топосъёмка', term: '3–5 дней', tag: 'обязательно', text: 'План участка М 1:500.', you: 'выписка ЕГРН' },
      { title: 'Геология', term: '7–10 дней', tag: 'обязательно', text: 'Скважины и лаборатория.', you: 'доступ на участок' },
      { title: 'Вынос осей', term: '1 день', tag: 'по желанию', text: 'Разбивка осей здания перед стройкой.' },
    ],
  },
};

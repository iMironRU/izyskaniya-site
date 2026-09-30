import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PriceMatrix } from './PriceMatrix';

// Числа — примеры для витрины. На сайте ячейки считает priceMatrix() из data/pricing.
const meta = { title: 'Components/PriceMatrix', component: PriceMatrix } satisfies Meta<typeof PriceMatrix>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Geology: Story = {
  args: {
    name: 'geo',
    caption: 'Геология под частный дом',
    sub: 'Пятно застройки × этажность. Скважины, лаборатория, выезд и отчёт.',
    rowAxis: 'Пятно застройки',
    rows: ['до 100 м²', '100–150 м²', '150–250 м²'],
    cols: ['1 этаж', '2 этажа', '3 этажа', 'с подвалом'],
    cells: [
      ['58 500 ₽', '67 000 ₽', '75 500 ₽', '84 000 ₽'],
      ['70 000 ₽', '81 000 ₽', '92 500 ₽', '104 000 ₽'],
      ['86 000 ₽', '99 000 ₽', '112 000 ₽', '126 000 ₽'],
    ],
  },
};

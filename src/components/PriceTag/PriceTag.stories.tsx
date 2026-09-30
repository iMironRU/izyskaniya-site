import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PriceTag } from './PriceTag';

// Числа в стори — примеры для витрины, не цены компании. На сайте цены приходят из движка.
const meta = { title: 'Components/PriceTag', component: PriceTag } satisfies Meta<typeof PriceTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Exact: Story = { args: { kind: 'exact', total: 117800 } };
export const ExactLarge: Story = { args: { kind: 'exact', total: 117800, size: 'lg', note: 'Предварительно, без НДС' } };
export const Range: Story = { args: { kind: 'range', min: 105000, max: 176000, size: 'lg', note: 'Точнее — после ТЗ проектировщика' } };
export const From: Story = { args: { kind: 'from', value: 25000 } };

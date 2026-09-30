import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PriceTag } from './PriceTag';

const meta = { title: 'Components/PriceTag', component: PriceTag } satisfies Meta<typeof PriceTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Exact: Story = { args: { kind: 'exact', total: 117800, size: 'lg', note: 'Без НДС. Предварительный расчёт.' } };
export const Range: Story = { args: { kind: 'range', min: 105000, max: 176000, size: 'lg' } };
export const From: Story = { args: { kind: 'from', value: 38000 } };

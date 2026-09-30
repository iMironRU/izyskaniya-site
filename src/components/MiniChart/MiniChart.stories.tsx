import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MiniChart } from './MiniChart';

const meta = { title: 'Components/MiniChart', component: MiniChart } satisfies Meta<typeof MiniChart>;
export default meta;
type Story = StoryObj<typeof meta>;

// Демо-значения из хендоффа.
export const Default: Story = {
  args: { years: [2020, 2021, 2022, 2023, 2024, 2025].map((y, i) => ({ year: String(y), value: [5400, 6100, 7300, 8000, 9100, 9800][i] })) },
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalcProgress } from './CalcProgress';

const meta = { title: 'Components/CalcProgress', component: CalcProgress } satisfies Meta<typeof CalcProgress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = { args: { step: 1, total: 6, branch: 'Частный дом' } };
export const Middle: Story = { args: { step: 3, total: 6, branch: 'Частный дом' } };
export const WithoutFloors: Story = { args: { step: 2, total: 5, branch: 'Баня или гараж' } };

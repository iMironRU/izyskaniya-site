import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QuizProgress } from './QuizProgress';

const meta = { title: 'Components/QuizProgress', component: QuizProgress } satisfies Meta<typeof QuizProgress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = { args: { current: 1, total: 7, section: 'Общие вопросы' } };
export const Middle: Story = { args: { current: 3, total: 7, section: 'Геология' } };
export const Last: Story = { args: { current: 12, total: 12, section: 'Топосъёмка' } };

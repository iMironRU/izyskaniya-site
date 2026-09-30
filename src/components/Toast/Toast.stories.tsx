import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToastView } from './Toast';

const meta = { title: 'Components/Toast' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { render: () => <ToastView>Ссылка скопирована</ToastView> };
export const Success: Story = { render: () => <ToastView tone="success">Реквизиты скопированы</ToastView> };
export const Error: Story = { render: () => <ToastView tone="error">Не удалось скопировать</ToastView> };

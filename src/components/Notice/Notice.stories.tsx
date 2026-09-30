import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button/Button';
import { Notice } from './Notice';

const meta = { title: 'Components/Notice', component: Notice } satisfies Meta<typeof Notice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { tone: 'success', title: 'Заявка отправлена', children: 'Инженер свяжется с вами в рабочее время удобным способом.' },
};
export const Error: Story = {
  args: {
    tone: 'error',
    title: 'Не получилось отправить',
    children: 'Попробуйте ещё раз или позвоните нам — расчёт сохранён.',
    action: <Button variant="secondary">Повторить</Button>,
  },
};
export const Offline: Story = {
  args: { tone: 'offline', title: 'Нет сети', children: 'Мы сохранили заявку и отправим её, когда связь появится.' },
};
export const Info: Story = {
  args: { tone: 'info', title: 'Цены обновились', children: 'Расчёт по ссылке пересчитан по новым ценам.' },
};

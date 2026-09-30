import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArrowRight, Phone } from 'lucide-react';
import { Button, ButtonLink } from './Button';

const meta = { title: 'Components/Button', component: Button, args: { children: 'Рассчитать стоимость' } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Отправить ТЗ' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Копировать' } };
export const Compact: Story = { args: { compact: true } };
export const Icon: Story = { args: { variant: 'secondary', icon: true, 'aria-label': 'Позвонить', children: <Phone className="size-icon" strokeWidth={1.5} /> } };
export const Block: Story = { args: { block: true, children: 'Далее' } };
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Active: Story = { parameters: { pseudo: { active: true } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button>Рассчитать</Button>
        <Button variant="secondary">Отправить ТЗ</Button>
        <Button variant="ghost">Копировать</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="#" iconEnd={<ArrowRight className="size-icon" strokeWidth={1.5} />}>
          Ссылка-кнопка
        </ButtonLink>
        <Button disabled>Неактивна</Button>
        <Button variant="secondary" loading>
          Отправить
        </Button>
      </div>
    </div>
  ),
};

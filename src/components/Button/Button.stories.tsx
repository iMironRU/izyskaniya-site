import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Рассчитать программу работ' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'text'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Позвонить' } };
export const Text: Story = { args: { variant: 'text', children: 'Подробнее о нормативе' } };
export const Large: Story = { args: { size: 'lg', block: true, children: 'Дальше' } };
export const Disabled: Story = { args: { disabled: true, children: 'Дальше' } };
export const Loading: Story = { args: { loading: true, children: 'Отправляем' } };

/** Все варианты и состояния на одном экране — эталон для снапшота. */
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      {(['primary', 'secondary', 'text'] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          <Button variant={variant}>Обычная</Button>
          <Button variant={variant} disabled>
            Неактивна
          </Button>
          <Button variant={variant} loading>
            Загрузка
          </Button>
        </div>
      ))}
      <Button size="lg" block>
        Во всю ширину
      </Button>
    </div>
  ),
};

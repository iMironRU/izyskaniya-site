import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TrustStrip } from './TrustStrip';

const meta = { title: 'Components/TrustStrip', component: TrustStrip } satisfies Meta<typeof TrustStrip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'СРО', value: '[№ в реестре]' },
      { label: 'Лаборатория', value: '[аттестат]' },
      { label: 'Работаем', value: 'с [год]' },
      { label: 'Объектов', value: '[N]' },
      { label: 'Яндекс Карты', value: '[4,9 · N отзывов]' },
    ],
  },
};

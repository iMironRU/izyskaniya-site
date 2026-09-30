import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button/Button';
import { StickyBar } from './StickyBar';

const meta = { title: 'Components/StickyBar', component: StickyBar, parameters: { layout: 'fullscreen' }, tags: ['phone-only'] } satisfies Meta<typeof StickyBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { phoneTel: '+70000000000', calcHref: '/raschet/', inline: true } };
export const Calculator: Story = {
  args: {
    inline: true,
    children: (
      <>
        <Button variant="secondary" block className="flex-1">
          Назад
        </Button>
        <Button block className="flex-1">
          Далее
        </Button>
      </>
    ),
  },
};

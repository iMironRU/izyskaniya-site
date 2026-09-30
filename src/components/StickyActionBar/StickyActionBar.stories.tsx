import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StickyActionBar } from './StickyActionBar';

const meta = {
  title: 'Components/StickyActionBar',
  component: StickyActionBar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StickyActionBar>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Видна только на телефоне (< md), поэтому снимается только в проекте phone. */
export const Default: Story = { args: { phoneTel: '+70000000000', actionHref: '#', inline: true }, tags: ['phone-only'] };

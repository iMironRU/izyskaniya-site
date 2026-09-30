import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Plate } from './Plate';

const meta = { title: 'Components/Plate', component: Plate } satisfies Meta<typeof Plate>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = { args: { label: 'скан разреза', ratio: '3/4' }, render: (a) => <div className="max-w-measure"><Plate {...a} /></div> };
export const Wide: Story = { args: { label: 'фото буровой на объекте', ratio: '16/9' } };

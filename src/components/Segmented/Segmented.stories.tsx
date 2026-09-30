import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Segmented } from './Segmented';

const meta = { title: 'Components/Segmented' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ block }: { block?: boolean }) {
  const [v, setV] = useState<'list' | 'map'>('list');
  return <Segmented name="view" label="Вид" block={block} value={v} onChange={setV} options={[{ value: 'list', label: 'Список' }, { value: 'map', label: 'Карта' }]} />;
}
export const Inline: Story = { render: () => <Demo /> };
export const Block: Story = { render: () => <Demo block /> };

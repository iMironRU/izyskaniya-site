import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { FilterChips, SectionChips } from './SectionChips';

const meta = { title: 'Components/SectionChips' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sections: Story = {
  render: () => <SectionChips sections={['Объекты', 'Что входит', 'Объём', 'Сроки', 'Цены', 'Образцы', 'Кейс', 'Вопросы'].map((l, i) => ({ id: `s${i}`, label: l }))} />,
};

function Filter() {
  const [v, setV] = useState<'all' | 'dom' | 'proekt'>('dom');
  return (
    <FilterChips
      name="task"
      label="Задача"
      value={v}
      onChange={setV}
      options={[
        { value: 'all', label: 'Все' },
        { value: 'dom', label: 'Под дом' },
        { value: 'proekt', label: 'Под проект' },
      ]}
    />
  );
}
export const Filters: Story = { render: () => <Filter /> };

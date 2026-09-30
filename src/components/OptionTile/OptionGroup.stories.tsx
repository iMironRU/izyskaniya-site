import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Building2, Home, Warehouse } from 'lucide-react';
import { useState } from 'react';
import { OptionGroup } from './OptionGroup';
import type { Option } from './OptionTile';

const floors: Option[] = [
  { value: '1', label: '1 этаж', hint: 'Баня, гараж, лёгкий дом' },
  { value: '2', label: '2 этажа', hint: 'Типовой частный дом' },
  { value: '3', label: '3 этажа и выше', hint: 'Нагрузка больше — скважины глубже' },
  { value: 'unknown', label: 'Не знаю', hint: 'Подставим безопасное значение и отметим это', unknown: true },
];

function Single({ initial, options = floors }: { initial: string | null; options?: Option[] }) {
  const [v, setV] = useState(initial);
  return <OptionGroup name="floors" legend="Сколько этажей?" options={options} value={v} onChange={setV} />;
}

const meta = { title: 'Components/OptionGroup', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Single initial={null} /> };
export const Selected: Story = { render: () => <Single initial="2" /> };
export const UnknownSelected: Story = { render: () => <Single initial="unknown" /> };
export const Hover: Story = { render: () => <Single initial={null} />, parameters: { pseudo: { hover: ['label:first-of-type'] } } };
export const FocusVisible: Story = {
  render: () => <Single initial="2" />,
  parameters: { pseudo: { focusVisible: ['input[value="2"]'] } },
};
export const Disabled: Story = {
  render: () => <Single initial={null} options={floors.map((o, i) => (i === 2 ? { ...o, disabled: true } : o))} />,
};
export const WithIcons: Story = {
  render: () => (
    <Single
      initial="house"
      options={[
        { value: 'house', label: 'Жилой дом', hint: 'Частный дом, ИЖС', icon: <Home className="size-icon-lg" strokeWidth={1.5} /> },
        { value: 'light', label: 'Баня, гараж', hint: 'Лёгкая постройка', icon: <Warehouse className="size-icon-lg" strokeWidth={1.5} /> },
        { value: 'commercial', label: 'Коммерческий объект', hint: 'Цену покажем вилкой', icon: <Building2 className="size-icon-lg" strokeWidth={1.5} /> },
      ]}
    />
  ),
};

function Multi() {
  const [v, setV] = useState<string[]>(['geology']);
  return (
    <OptionGroup
      mode="multi"
      name="services"
      legend="Что нужно сделать?"
      layout="grid"
      value={v}
      onChange={setV}
      options={[
        { value: 'geology', label: 'Геология', hint: 'Скважины и свойства грунтов' },
        { value: 'topo', label: 'Топосъёмка', hint: 'План участка с рельефом' },
      ]}
    />
  );
}
export const MultiSelect: Story = { render: () => <Multi /> };

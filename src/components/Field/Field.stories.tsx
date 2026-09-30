import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CadastralField, NumberField, PhoneField, TextField } from './Field';

const meta = { title: 'Components/Field', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Number: Story = {
  render: () => <NumberField label="Длина большей стороны дома" hint="По проекту или примерно." unit="м" defaultValue="12,5" />,
};
export const NumberEmpty: Story = {
  render: () => <NumberField label="Площадь участка" hint="10 соток = 0,1 га." unit="га" />,
};
export const NumberError: Story = {
  render: () => <NumberField label="Длина большей стороны дома" unit="м" defaultValue="0" error="Допустимо от 3 до 300 м" />,
};
export const Phone: Story = { render: () => <PhoneField label="Телефон" defaultValue="+7 (999) 123-45-67" /> };
export const PhoneFocus: Story = {
  render: () => <PhoneField label="Телефон" />,
  parameters: { pseudo: { focusVisible: ['input'] } },
};
export const Cadastral: Story = {
  render: () => <CadastralField label="Кадастровый номер" hint="Необязательно. Нужен только инженеру." defaultValue="56:44:0301001:123" />,
};
export const Text: Story = { render: () => <TextField label="Как к вам обращаться" autoComplete="name" /> };
export const Disabled: Story = { render: () => <TextField label="Имя" defaultValue="Иван" disabled /> };
export const Hover: Story = {
  render: () => <TextField label="Имя" />,
  parameters: { pseudo: { hover: ['input'] } },
};

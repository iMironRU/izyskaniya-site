import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { CadastralField, Checkbox, NumberField, PhoneField, TextAreaField, TextField } from './Input';

const meta = { title: 'Components/Input' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = { render: () => <TextField label="Имя" autoComplete="name" /> };
export const NumberUnit: Story = { render: () => <NumberField label="Длина" unit="м" defaultValue="12" /> };
export const NumberError: Story = { render: () => <NumberField label="Длина" unit="м" defaultValue="0" error="Введите длину от 3 до 300 м" /> };
export const Phone: Story = { render: () => <PhoneField label="Телефон" defaultValue="+7 (900) 000-00-00" /> };
export const PhoneFocus: Story = { render: () => <PhoneField label="Телефон" />, parameters: { pseudo: { focusVisible: ['input'] } } };
export const Hover: Story = { render: () => <TextField label="Имя" />, parameters: { pseudo: { hover: ['input'] } } };
export const Cadastral: Story = { render: () => <CadastralField label="Кадастровый номер" hint="Формат NN:NN:NNNNNN(N):N" /> };
export const Disabled: Story = { render: () => <TextField label="Имя" defaultValue="Иван" disabled /> };
export const TextArea: Story = { render: () => <TextAreaField label="Комментарий" /> };
function Consent() {
  const [v, setV] = useState(false);
  return (
    <Checkbox checked={v} onChange={setV} error={v ? undefined : 'Нужно согласие, чтобы мы могли связаться'}>
      Согласен на <a href="#">обработку персональных данных</a>
    </Checkbox>
  );
}
export const ConsentCheckbox: Story = { render: () => <Consent /> };

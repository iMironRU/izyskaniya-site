import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NormLink } from '../Primitives/Primitives';
import { PassportTable } from './PassportTable';

const meta = { title: 'Components/PassportTable', component: PassportTable } satisfies Meta<typeof PassportTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Service: Story = {
  args: {
    items: [
      { key: 'Цена', value: 'от [цена из data/pricing]' },
      { key: 'Срок', value: 'от 7 рабочих дней' },
      { key: 'Норматив', value: <NormLink code="СП 47.13330.2016" /> },
    ],
  },
};
export const Requisites: Story = {
  args: {
    items: [
      { key: 'Полное наименование', value: '[ООО «Название»]', copy: '[ООО «Название»]' },
      { key: 'ИНН', value: '[ИНН]', copy: '[ИНН]' },
      { key: 'ОГРН', value: '[ОГРН]', copy: '[ОГРН]' },
    ],
    copyAll: '[ООО «Название»], ИНН [ИНН], ОГРН [ОГРН]',
  },
};

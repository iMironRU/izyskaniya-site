import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { KeyValue } from './KeyValue';

// Значения — заглушки. На сайте паспорт строится из data/company.yaml.
const meta = { title: 'Components/KeyValue', component: KeyValue } satisfies Meta<typeof KeyValue>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Passport: Story = {
  args: {
    items: [
      { term: 'Полное наименование', value: '[ООО «Название»]' },
      { term: 'ИНН / ОГРН', value: '[ИНН] / [ОГРН]' },
      { term: 'СРО', value: <a href="#">[№ в реестре]</a> },
      { term: 'Лаборатория', value: '[аттестат аккредитации]' },
    ],
  },
};
export const TwoColumns: Story = {
  args: {
    columns: 2,
    items: [
      { term: 'СРО', value: '[№ в реестре]' },
      { term: 'Лаборатория', value: 'своя, [аттестат]' },
      { term: 'Буровые', value: '[N] установок' },
      { term: 'Объектов', value: '[N] с [год]' },
    ],
  },
};

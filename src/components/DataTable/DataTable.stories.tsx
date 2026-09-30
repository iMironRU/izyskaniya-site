import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NormRef } from '../NormRef/NormRef';
import { PriceTag } from '../PriceTag/PriceTag';
import { DataTable } from './DataTable';
import { PriceMatrix } from './PriceMatrix';

// Числа — примеры для витрины. На сайте таблицы строятся из движка и data/.
const meta = { title: 'Components/DataTable' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Work = { id: string; title: string; qty: string; total: number; norm: string };
const works: Work[] = [
  { id: 'drill', title: 'Бурение скважин', qty: '30 п.м', total: 54000, norm: 'СП 47.13330.2016' },
  { id: 'lab', title: 'Лабораторные испытания грунтов', qty: '12 проб', total: 30000, norm: 'СП 446.1325800.2019' },
  { id: 'report', title: 'Технический отчёт', qty: '1', total: 15000, norm: 'СП 47.13330.2016' },
];

export const Works: Story = {
  render: () => (
    <DataTable<Work>
      caption="Состав работ"
      rows={works}
      rowKey={(r) => r.id}
      columns={[
        { key: 'title', header: 'Работа', cell: (r) => r.title, primary: true },
        { key: 'norm', header: 'Норматив', cell: (r) => <NormRef code={r.norm} /> },
        { key: 'qty', header: 'Объём', cell: (r) => r.qty, align: 'end' },
        { key: 'total', header: 'Стоимость', cell: (r) => <PriceTag kind="exact" total={r.total} />, align: 'end' },
      ]}
      footer={{ label: 'Итого', value: <PriceTag kind="exact" total={99000} /> }}
    />
  ),
};

export const Matrix: Story = {
  render: () => (
    <PriceMatrix
      caption="Геология для частного дома"
      rowAxis="Длина дома"
      colAxis="Этажей"
      rows={['до 15 м', 'до 25 м', 'до 40 м']}
      cols={['1 этаж', '2 этажа', '3 и выше']}
      cells={[
        [<PriceTag key="a" kind="from" value={83000} />, <PriceTag key="b" kind="from" value={92000} />, <PriceTag key="c" kind="from" value={101000} />],
        [<PriceTag key="a" kind="from" value={104000} />, <PriceTag key="b" kind="from" value={115000} />, <PriceTag key="c" kind="from" value={127000} />],
        [<PriceTag key="a" kind="from" value={125000} />, <PriceTag key="b" kind="from" value={139000} />, <PriceTag key="c" kind="from" value={152000} />],
      ]}
    />
  ),
};

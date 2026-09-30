import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NormLink } from '../Primitives/Primitives';
import { Table } from './Table';

// Демо-строки из хендоффа (страница направления «Что входит»).
type Row = { stage: string; what: string; norm: string };
const rows: Row[] = [
  { stage: 'Сбор данных', what: 'Архивные материалы, фондовые изыскания', norm: 'СП 47.13330.2016' },
  { stage: 'Бурение', what: 'Скважины, отбор проб', norm: 'СП 446.1325800.2019' },
  { stage: 'Лаборатория', what: 'Физико-механические свойства грунтов', norm: 'ГОСТ 5180-2015' },
  { stage: 'Отчёт', what: 'Разрезы, колонки, рекомендации', norm: 'СП 47.13330.2016' },
];
const long = Array.from({ length: 9 }, (_, i) => ({ stage: `Этап ${i + 1}`, what: 'Описание работ', norm: 'СП 47.13330.2016' }));

const cols = [
  { key: 'stage', header: 'Этап', cell: (r: Row) => r.stage, primary: true },
  { key: 'what', header: 'Что делаем', cell: (r: Row) => r.what },
  { key: 'norm', header: 'Норматив', cell: (r: Row) => <NormLink code={r.norm} /> },
];

const meta = { title: 'Components/Table' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const RuleA: Story = { render: () => <Table<Row> caption="Что входит" rows={rows} rowKey={(r) => r.stage} columns={cols} /> };
export const RuleC: Story = { render: () => <Table<Row> caption="Перечень испытаний" rows={long} rowKey={(r) => r.stage} columns={cols} /> };
export const WithTotal: Story = {
  render: () => (
    <Table<Row> caption="Состав работ" rows={rows} rowKey={(r) => r.stage} columns={cols} footer={{ label: 'Итого', value: '[сумма из движка]' }} />
  ),
};

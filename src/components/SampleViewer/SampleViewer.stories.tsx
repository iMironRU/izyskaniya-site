import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SampleViewer, type Sample } from './SampleViewer';

// Демо-выноски для разреза (хендофф). На сайте — data/site/samples.yaml.
const items: Sample[] = [
  {
    id: 'razrez',
    type: 'Разрез',
    title: 'Инженерно-геологический разрез',
    callouts: [
      { n: 1, text: 'Номера скважин и их абсолютные отметки устья.', col: 3, row: 2 },
      { n: 2, text: 'Слои грунта (ИГЭ) — штриховка по ГОСТ 21.302.', col: 6, row: 7 },
      { n: 3, text: 'Уровень грунтовых вод на дату бурения.', col: 9, row: 10 },
    ],
  },
  { id: 'kolonka', type: 'Колонка', title: 'Колонка скважины', meta: 'Отчёт № [N]-ИГИ · 10 м' },
];

function Demo() {
  const [i, setI] = useState(0);
  return <SampleViewer items={items} index={i} onIndex={setI} onClose={() => {}} />;
}

const meta = { title: 'Components/SampleViewer', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = { render: () => <div className="min-h-screen"><Demo /></div> };

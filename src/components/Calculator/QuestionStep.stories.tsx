import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { mini } from '@/engine/__fixtures__/mini';
import { UNKNOWN, type Question } from '@/engine/schema';
import { QuestionStep } from './QuestionStep';
import type { Draft } from './quiz';

// Вопросы — примеры в формате data/questions. На сайте они приходят из data/.
const floors: Question = {
  id: 'floors',
  service: 'geology',
  title: 'Сколько этажей?',
  kind: 'choice',
  options: [
    { value: '1', label: '1 этаж', hint: 'Баня, гараж, лёгкий дом' },
    { value: '2', label: '2 этажа', hint: 'Типовой частный дом' },
    { value: '3', label: '3 этажа и выше', hint: 'Нагрузка больше — скважины глубже' },
  ],
  why: { text: 'От нагрузки на грунт зависит глубина скважин.', norm: { code: 'СП 47.13330.2016' } },
  unknown: { label: 'Не знаю', assume: '3', note: 'Приняли 3 этажа — так глубина скважин точно достаточна.', demo: true },
};
const length: Question = {
  id: 'length_m',
  service: 'geology',
  title: 'Какая длина у большей стороны дома?',
  kind: 'number',
  number: { unit: 'м', min: 3, max: 300, step: 0.5 },
  unknown: { label: 'Не знаю', assume: 15, note: 'Приняли 15 м по большей стороне.', demo: true },
};
const services = mini.questions[0];
const distance: Question = { ...mini.questions[2], ui: 'map' };

function Step({ question, initial = null, error, map }: { question: Question; initial?: Draft; error?: string; map?: boolean }) {
  const [draft, setDraft] = useState<Draft>(initial);
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  return (
    <QuestionStep
      question={question}
      draft={draft}
      onDraft={setDraft}
      error={error}
      location={map ? { office: { lat: 51.77, lng: 55.1 }, zoom: 8, pricing: mini.pricing, point, onPoint: setPoint } : undefined}
    />
  );
}

const meta = { title: 'Screens/Calculator/QuestionStep' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Choice: Story = { render: () => <Step question={floors} /> };
export const ChoiceSelected: Story = { render: () => <Step question={floors} initial="2" /> };
export const ChoiceUnknown: Story = { render: () => <Step question={floors} initial={UNKNOWN} /> };
export const ChoiceError: Story = { render: () => <Step question={floors} error="Выберите вариант или «Не знаю»" /> };
export const Multi: Story = { render: () => <Step question={services} initial={['geology']} /> };
export const NumberInput: Story = { render: () => <Step question={length} initial="12,5" /> };
export const NumberError: Story = { render: () => <Step question={length} initial="1" error="Допустимо от 3 до 300 м" /> };
export const NumberUnknown: Story = { render: () => <Step question={length} initial={UNKNOWN} /> };
/** Карта грузит тайлы из сети — снапшот не снимаем. */
export const Location: Story = { render: () => <Step question={distance} map />, tags: ['no-snapshot'] };

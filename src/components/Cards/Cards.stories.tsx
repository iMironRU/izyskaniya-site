import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArticleCard, CaseCard, DirectionCard, DocumentCard, EquipmentCard, LogoCard, PersonCard, SampleCard, ScenarioRow, ServiceCard } from './Cards';

// Тексты — демо из хендоффа; цены на сайте считает движок.
const meta = { title: 'Components/Cards' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Directions: Story = {
  render: () => (
    <div className="grid-auto-card grid gap-3">
      <DirectionCard href="#" title="Инженерная геология" text="Бурение, лаборатория, отчёт для проекта и экспертизы" from="от [цена]" days="от 7 дней" />
      <DirectionCard href="#" title="Геодезия и топосъёмка" text="Топопланы, вынос осей, исполнительные съёмки" from="от [цена]" days="от 3 дней" />
      <DirectionCard href="#" title="Инженерная экология" text="Радиация, почвы, воздух, шум — для экспертизы" from="от [цена]" days="от 14 дней" dimmed />
    </div>
  ),
};
export const DirectionHover: Story = {
  render: () => <DirectionCard href="#" title="Инженерная геология" text="Бурение, лаборатория, отчёт" from="от [цена]" days="от 7 дней" />,
  parameters: { pseudo: { hover: ['article'] } },
};
export const Service: Story = { render: () => <div className="max-w-measure"><ServiceCard href="#" title="Топосъёмка для газа и воды" text="План М 1:500 для техусловий" from="от [цена]" /></div> };
export const Scenarios: Story = {
  render: () => (
    <ol className="m-0 list-none border-t border-border-strong p-0">
      <ScenarioRow n={1} href="#" title="Строю дом" text="Геология и топосъёмка под фундамент" price="от [цена]" />
      <ScenarioRow n={2} href="#" title="Проектирую объект" text="Изыскания под экспертизу" price="по ТЗ" />
    </ol>
  ),
};
export const Samples: Story = {
  render: () => (
    <div className="grid-auto-sample grid gap-4">
      <SampleCard type="Разрез" title="Инженерно-геологический разрез" meta="Отчёт № [N]-ИГИ" onOpen={() => {}} />
      <SampleCard type="Колонка" title="Колонка скважины" meta="Отчёт № [N]-ИГИ" onOpen={() => {}} />
    </div>
  ),
};
export const Cases: Story = {
  render: () => (
    <div className="grid-auto-wide grid gap-3">
      <CaseCard href="#" kicker="Частный дом · [район]" title="Дом 10 × 12 м на склоне" text="4 скважины по 10 м, выявили линзу торфа" figure="сэкономили [сумма]" />
    </div>
  ),
};
export const People: Story = {
  render: () => (
    <div className="grid-auto-person grid gap-4">
      <PersonCard name="[Имя Фамилия]" role="Главный инженер" note="Стаж [N] лет" />
      <PersonCard name="[Имя Фамилия]" role="Руководитель лаборатории" note="Стаж [N] лет" />
    </div>
  ),
};
export const Others: Story = {
  render: () => (
    <div className="grid-auto-wide grid gap-4">
      <EquipmentCard title="Буровая установка [модель]" specs={['Глубина до [N] м', 'Шасси [марка]']} />
      <DocumentCard title="Выписка из реестра СРО" meta="PDF · [N] КБ" href="#" />
      <ArticleCard href="#" kicker="Геология" title="Зачем геология для частного дома" minutes={6} />
      <LogoCard name="[заказчик]" />
    </div>
  ),
};

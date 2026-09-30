import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Layers } from 'lucide-react';
import { CaseCard, SampleCard, ServiceCard } from './Card';

// Тексты и числа — примеры для витрины. На сайте карточки строятся из data/.
const meta = { title: 'Components/Card' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const service = (
  <ServiceCard
    href="#"
    icon={<Layers className="size-6" strokeWidth={1.75} />}
    title="Геология для частного дома"
    summary="Скважины, лаборатория и отчёт с рекомендациями по фундаменту."
    priceFrom={83000}
  />
);

export const Service: Story = { render: () => <div className="max-w-sm">{service}</div> };
export const ServiceHover: Story = { render: () => <div className="max-w-sm">{service}</div>, parameters: { pseudo: { hover: ['article'] } } };
export const ServiceFocus: Story = { render: () => <div className="max-w-sm">{service}</div>, parameters: { pseudo: { focusVisible: ['a'] } } };
export const Sample: Story = {
  render: () => (
    <div className="max-w-xs">
      <SampleCard href="#" type="section" title="Инженерно-геологический разрез" meta="[Объект], [год]" />
    </div>
  ),
};
export const Case: Story = {
  render: () => (
    <div className="max-w-sm">
      <CaseCard
        href="#"
        title="[Название объекта]"
        place="[Населённый пункт]"
        figures={[
          { value: '[N]', label: 'скважин' },
          { value: '[N] м', label: 'глубина' },
          { value: '[N] дн.', label: 'срок' },
          { value: '[N] га', label: 'съёмка' },
        ]}
      />
    </div>
  ),
};

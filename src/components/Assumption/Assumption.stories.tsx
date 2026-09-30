import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AssumptionBadge, AssumptionNote } from './Assumption';

const meta = { title: 'Components/Assumption' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Badge: Story = { render: () => <AssumptionBadge /> };
export const Note: Story = {
  render: () => (
    <AssumptionNote>
      Приняли 3 этажа — так глубина скважин точно достаточна. В результате это будет отмечено, инженер уточнит с вами.
    </AssumptionNote>
  ),
};
export const InResultRow: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2 text-md">
      <span>Фундамент: сваи</span>
      <AssumptionBadge />
    </div>
  ),
};

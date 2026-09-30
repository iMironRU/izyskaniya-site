import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BoreholeColumn } from './BoreholeColumn';
import { BoreholeScheme } from './BoreholeScheme';

const meta = { title: 'Components/Borehole' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

// Демо-разрез из хендоффа.
export const Column: Story = {
  render: () => (
    <div className="max-w-measure">
      <BoreholeColumn
        title="Скважина 1"
        elevation="Абс. отм. [254,30]"
        water={3.4}
        layers={[
          { to: 0.3, name: 'Почвенный слой', pattern: 'soil' },
          { to: 2.8, name: 'Суглинок', note: 'тугопластичный', pattern: 'loam' },
          { to: 5.6, name: 'Песок', note: 'средней крупности', pattern: 'sand' },
          { to: 10, name: 'Глина', note: 'полутвёрдая', pattern: 'clay' },
        ]}
      />
    </div>
  ),
};
export const Scheme3: Story = { render: () => <div className="max-w-measure"><BoreholeScheme length={12} width={10} count={3} /></div> };
export const Scheme5: Story = { render: () => <div className="max-w-measure"><BoreholeScheme length={36} width={14} count={5} /></div> };

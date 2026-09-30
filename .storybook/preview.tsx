import type { Preview } from '@storybook/nextjs-vite';
import '../src/styles/fonts';
import '../src/styles/globals.css';

const preview: Preview = {
  // Отступ вокруг стори: контур фокуса (outline-offset) не обрезается на снапшоте.
  decorators: [(Story) => <div className="p-2">{Story()}</div>],
  parameters: {
    layout: 'padded',
    viewport: {
      options: {
        phone: { name: 'Телефон 390', styles: { width: '390px', height: '844px' } },
        desktop: { name: 'Десктоп 1280', styles: { width: '1280px', height: '800px' } },
      },
    },
  },
};

export default preview;

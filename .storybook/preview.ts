import type { Preview } from '@storybook/nextjs-vite';
import '../src/styles/globals.css';

const preview: Preview = {
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

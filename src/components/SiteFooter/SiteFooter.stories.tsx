import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SiteFooter } from './SiteFooter';

const meta = { title: 'Components/SiteFooter', component: SiteFooter, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    contacts: [
      { label: 'Телефон', value: <a href="tel:+70000000000">+7 (000) 000-00-00</a> },
      { label: 'Почта', value: <a href="mailto:info@example.com">info@example.com</a> },
      { label: 'Адрес', value: '[Город, улица, дом]' },
    ],
    nav: [
      { href: '#', label: 'Калькулятор' },
      { href: '#', label: 'Услуги' },
      { href: '#', label: 'Цены' },
      { href: '#', label: 'Образцы отчётов' },
      { href: '#', label: 'Объекты' },
      { href: '#', label: 'О компании' },
      { href: '#', label: 'Как проверить подрядчика' },
      { href: '#', label: 'Контакты' },
    ],
    legal: ['[ООО «Название»], ИНН [ИНН], ОГРН [ОГРН]', 'Член СРО [название], № [номер] в реестре'],
    disclaimer: 'Цены на сайте предварительные и не являются публичной офертой.',
  },
};

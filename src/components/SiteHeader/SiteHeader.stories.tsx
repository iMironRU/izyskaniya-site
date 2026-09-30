import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogoPlaceholder, SiteHeader } from './SiteHeader';

// Название и телефон — заглушки. На сайте — из data/company.yaml.
const args = {
  logo: <LogoPlaceholder name="[Название компании]" />,
  nav: [
    { href: '#', label: 'Калькулятор' },
    { href: '#', label: 'Услуги' },
    { href: '#', label: 'Цены' },
    { href: '#', label: 'Образцы отчётов' },
    { href: '#', label: 'О компании' },
    { href: '#', label: 'Контакты' },
  ],
  phone: { display: '+7 (000) 000-00-00', tel: '+70000000000' },
};

const meta = { title: 'Components/SiteHeader', component: SiteHeader, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof SiteHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args };
export const MenuOpen: Story = { args: { ...args, defaultOpen: true } };

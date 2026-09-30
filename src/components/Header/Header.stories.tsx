import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { demoContacts, demoDirections, demoLinks } from '@/site/__fixtures__/site';
import { Header } from './Header';

const args = {
  brand: 'Геоплан',
  brandNote: 'логотип — заглушка',
  homeHref: '/',
  servicesHref: '/uslugi/',
  calcHref: '/raschet/',
  links: demoLinks,
  directions: demoDirections,
  contacts: demoContacts,
};

const meta = { title: 'Components/Header', component: Header, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args };
export const Current: Story = { args: { ...args, current: '/ceny/' } };
/** Панель «Услуги» — только desktop; на телефоне скрыта. */
export const ServicesOpen: Story = { args: { ...args, defaultPanel: true }, render: (a) => <div className="min-h-screen"><Header {...a} /></div> };
/** Мобильное меню — только ниже 1080px. */
export const MobileMenuOpen: Story = { args: { ...args, defaultMenu: true }, render: (a) => <div className="min-h-screen"><Header {...a} /></div>, tags: ['phone-only'] };

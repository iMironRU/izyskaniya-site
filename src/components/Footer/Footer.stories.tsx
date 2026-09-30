import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { demoContacts, demoDirections, demoLinks } from '@/site/__fixtures__/site';
import { FinalCta, Footer } from './Footer';

const meta = { title: 'Components/Footer', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const footer = (
  <Footer
    brand="Геоплан"
    services={demoDirections.map((d) => ({ href: d.href, label: d.title }))}
    sections={demoLinks}
    contacts={demoContacts}
    requisites={['[ООО «Название»]', 'ИНН [ИНН]', 'ОГРН [ОГРН]']}
    registries={[
      { href: '#', label: 'Реестр членов СРО' },
      { href: '#', label: 'Росаккредитация' },
      { href: '#', label: 'ЕГРЮЛ' },
    ]}
    privacyHref="/privacy/"
    years="[год]–2026"
    note="Данные на сайте — демо."
  />
);

export const WithCta: Story = {
  render: () => (
    <>
      <FinalCta calcHref="/raschet/" tzHref="#" phone={demoContacts.phone} hours={demoContacts.hours} />
      {footer}
    </>
  ),
};
export const Plain: Story = { render: () => footer };

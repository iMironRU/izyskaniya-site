import type { Metadata } from 'next';
import '@/styles/fonts';
import '@/styles/globals.css';
import { Footer } from '@/components/Footer/Footer';
import { loadSite } from '@/site/load';
import { href } from '@/site/routes';
import { Shell } from '@/site/ui/Shell';

const site = loadSite();

export const metadata: Metadata = {
  title: { default: `${site.company.name} — инженерные изыскания`, template: `%s — ${site.company.name}` },
  description: 'Геология, геодезия и экология для строительства. Калькулятор предварительной программы работ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = site.company;
  return (
    <html lang="ru">
      <body className="min-h-dvh bg-bg-default text-text-default">
        <Shell
          calcHref={href('raschet')}
          phoneTel={c.phone.tel}
          header={{
            brand: c.name,
            brandNote: c.brand_note,
            homeHref: href('home'),
            servicesHref: href('uslugi'),
            calcHref: href('raschet'),
            links: site.nav.header,
            directions: site.nav.directions,
            contacts: site.contacts,
          }}
          footer={
            <Footer
              brand={c.name}
              services={site.directions.map((d) => ({ href: d.href, label: d.title }))}
              sections={site.nav.sections}
              contacts={site.contacts}
              requisites={[c.legal_name, `ИНН ${c.inn}`, `ОГРН ${c.ogrn}`]}
              registries={c.registries}
              privacyHref={href('privacy')}
              years={`${c.founded}–${new Date().getFullYear()}`}
              note={c.demo ? 'Данные на сайте — демо.' : undefined}
            />
          }
        >
          {children}
        </Shell>
      </body>
    </html>
  );
}

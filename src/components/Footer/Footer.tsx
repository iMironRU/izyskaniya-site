import { ArrowRight } from 'lucide-react';
import type { NavLink, SiteContacts } from '@/site/nav';

export interface FinalCtaProps {
  title?: string;
  lead?: string;
  calcHref: string;
  tzHref: string;
  phone: SiteContacts['phone'];
  hours: string;
}

/** components/final-cta.md — три пути: рассчитать, отправить ТЗ, позвонить. Без формы. */
export function FinalCta({ title = 'Посчитаем и выедем на участок', lead = 'Выберите удобный способ. Форма с контактами появится, только когда вы сами её откроете.', calcHref, tzHref, phone, hours }: FinalCtaProps) {
  const rowClasses = 'group flex flex-col gap-1 border-b border-border-default py-4 text-text-default no-underline';
  return (
    <section className="mx-auto max-w-page page-x section-y" aria-labelledby="final-cta">
      <div className="grid gap-6 border-t border-border-strong pt-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 id="final-cta" className="m-0 type-h2">
            {title}
          </h2>
          <p className="m-0 max-w-measure type-body text-text-secondary">{lead}</p>
        </div>
        <div className="grid border-t border-border-default md:grid-cols-2 md:gap-x-6">
          <a href={calcHref} className={rowClasses}>
            <span className="flex items-center gap-2 type-title-card group-hover:text-text-accent-strong">
              Рассчитать онлайн <ArrowRight className="size-16 text-accent-default" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="type-small text-text-muted">Цена и состав работ за 2 минуты</span>
          </a>
          <a href={tzHref} className={rowClasses}>
            <span className="flex items-center gap-2 type-title-card group-hover:text-text-accent-strong">
              Отправить ТЗ <ArrowRight className="size-16 text-accent-default" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="type-small text-text-muted">Смета в течение рабочего дня</span>
          </a>
          <a href={`tel:${phone.tel}`} className={rowClasses}>
            <span className="font-heading text-24 leading-tight nums group-hover:text-text-accent-strong">{phone.display}</span>
            <span className="type-small text-text-muted">{hours}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export interface FooterProps {
  brand: string;
  services: NavLink[];
  sections: NavLink[];
  contacts: SiteContacts;
  requisites: string[];
  registries: NavLink[];
  privacyHref: string;
  years: string;
  note?: string;
}

const linkClasses = 'type-small text-text-default no-underline hover:text-text-accent-strong';
const Heading = ({ children }: { children: string }) => <h2 className="m-0 mb-3 type-kicker text-text-muted">{children}</h2>;

/** components/footer.md — Услуги, Разделы, Контакты, Реквизиты + реестры, политика. Сетка auto-fit minmax(200px). */
export function Footer({ brand, services, sections, contacts, requisites, registries, privacyHref, years, note }: FooterProps) {
  return (
    <footer className="bg-bg-surface pb-sticky-bar-height md:pb-0">
      <div className="mx-auto flex max-w-page flex-col gap-8 page-x py-12">
        <div className="grid-auto-footer grid gap-8">
          <nav aria-label="Услуги">
            <Heading>Услуги</Heading>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {services.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClasses}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Разделы">
            <Heading>Разделы</Heading>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {sections.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClasses}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <Heading>Контакты</Heading>
            <address className="flex flex-col gap-2 not-italic">
              <a href={`tel:${contacts.phone.tel}`} className="font-heading text-20 text-text-default no-underline nums">
                {contacts.phone.display}
              </a>
              <span className="type-small">{contacts.hoursFull ?? contacts.hours}</span>
              <a href={`mailto:${contacts.email}`} className="type-small text-text-accent underline underline-offset-4">
                {contacts.email}
              </a>
              <span className="type-small text-text-secondary">{contacts.address}</span>
              <span className="flex flex-wrap gap-3">
                {contacts.messengers.map((m) => (
                  <a key={m.href} href={m.href} className="type-small text-text-accent underline underline-offset-4">
                    {m.label}
                  </a>
                ))}
              </span>
            </address>
          </div>
          <div>
            <Heading>Реквизиты</Heading>
            <ul className="m-0 flex list-none flex-col gap-1 p-0 type-small nums">
              {requisites.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <h2 className="mt-4 mb-2 type-kicker text-text-muted">Проверить в реестрах</h2>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {registries.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="type-small text-text-accent underline underline-offset-4">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 border-t border-border-default pt-4 type-small text-text-muted md:flex-row">
          <span>
            © {years} {brand}.{note ? ` ${note}` : null}
          </span>
          <a href={privacyHref} className="text-text-default underline underline-offset-4">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </footer>
  );
}

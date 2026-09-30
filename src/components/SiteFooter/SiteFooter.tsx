import type { ReactNode } from 'react';
import type { NavLink } from '../SiteHeader/SiteHeader';

export interface SiteFooterProps {
  contacts: Array<{ label: string; value: ReactNode }>;
  nav: NavLink[];
  legal: string[];
  disclaimer: string;
}

export function SiteFooter({ contacts, nav, legal, disclaimer }: SiteFooterProps) {
  return (
    <footer className="border-t border-border-strong bg-bg-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <dl className="m-0 flex flex-col gap-3">
            {contacts.map((c) => (
              <div key={c.label} className="flex flex-col gap-1">
                <dt className="font-code text-xs tracking-wide text-text-secondary uppercase">{c.label}</dt>
                <dd className="m-0 text-lg">{c.value}</dd>
              </div>
            ))}
          </dl>
          <nav aria-label="Разделы сайта">
            <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-2 p-0">
              {nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="flex min-h-11 items-center text-md text-text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-border-default pt-4 text-sm text-text-secondary">
          {legal.map((l) => (
            <p key={l} className="m-0">
              {l}
            </p>
          ))}
          <p className="m-0">{disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}

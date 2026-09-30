'use client';

import { ChevronDown, Menu, Phone } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { NavDirection, NavLink, SiteContacts } from '@/site/nav';
import { ButtonLink } from '../Button/Button';
import { MobileMenu } from './MobileMenu';
import { ServicesPanel } from './ServicesPanel';

export interface HeaderProps {
  brand: string;
  brandNote?: string;
  homeHref: string;
  servicesHref: string;
  calcHref: string;
  links: NavLink[];
  directions: NavDirection[];
  contacts: SiteContacts;
  /** href текущего раздела — aria-current */
  current?: string;
  /** Для стори */
  defaultPanel?: boolean;
  defaultMenu?: boolean;
}

const navLinkClasses = 'text-15 text-text-default no-underline hover:text-text-accent-strong';

/** components/header.md — sticky; desktop ≥1080 (README: шапка мобильная ниже 1080px). */
export function Header({ brand, brandNote, homeHref, servicesHref, calcHref, links, directions, contacts, current, defaultPanel = false, defaultMenu = false }: HeaderProps) {
  const [panel, setPanel] = useState(defaultPanel);
  const [menu, setMenu] = useState(defaultMenu);
  const panelId = useId();
  const servicesBtn = useRef<HTMLButtonElement>(null);
  const burger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanel(false);
        servicesBtn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel]);

  const isCurrent = (href: string) => (current && (current === href || current.startsWith(href)) ? 'page' : undefined);

  return (
    <header className="sticky top-0 z-20 border-b border-border-default bg-bg-default">
      <div className="mx-auto flex h-header-height-mobile max-w-page items-center justify-between gap-6 page-x lg:h-header-height">
        <a href={homeHref} className="flex flex-col text-text-default no-underline">
          <span className="font-heading text-22 leading-tight font-semibold tracking-kicker uppercase">{brand}</span>
          {brandNote ? <span className="hidden text-11 text-text-muted lg:block">{brandNote}</span> : null}
        </a>

        <nav aria-label="Основное меню" className="hidden lg:block">
          <ul className="m-0 flex list-none items-center gap-6 p-0">
            <li>
              <button
                ref={servicesBtn}
                type="button"
                aria-expanded={panel}
                aria-controls={panelId}
                onClick={() => setPanel((p) => !p)}
                className={cn(navLinkClasses, 'flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-body', (panel || isCurrent(servicesHref)) && 'text-text-accent-strong')}
              >
                Услуги
                <ChevronDown className={cn('size-16 transition-transform', panel && 'rotate-180')} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} aria-current={isCurrent(l.href)} className={cn(navLinkClasses, isCurrent(l.href) && 'text-text-accent-strong')}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <a href={`tel:${contacts.phone.tel}`} className="hidden flex-col items-end text-text-default no-underline lg:flex">
            <span className="font-heading text-20 leading-tight nums">{contacts.phone.display}</span>
            <span className="text-11 text-text-muted">{contacts.hours}</span>
          </a>
          {/* Скрытие — на обёртке: display у кнопки (inline-flex) иначе спорит с hidden. */}
          <span className="hidden lg:block">
            <ButtonLink href={calcHref} compact>
              Рассчитать стоимость
            </ButtonLink>
          </span>
          <a href={`tel:${contacts.phone.tel}`} aria-label={`Позвонить: ${contacts.phone.display}`} className="flex size-tap items-center justify-center text-text-default lg:hidden">
            <Phone className="size-icon" strokeWidth={1.5} aria-hidden="true" />
          </a>
          <button ref={burger} type="button" aria-label="Открыть меню" aria-expanded={menu} onClick={() => setMenu(true)} className="-mr-3 flex size-tap cursor-pointer items-center justify-center border-0 bg-transparent text-text-default lg:hidden">
            <Menu className="size-icon" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      {panel ? (
        <div id={panelId} className="absolute inset-x-0 top-full hidden lg:block">
          <ServicesPanel directions={directions} allHref={servicesHref} onPick={() => setPanel(false)} />
        </div>
      ) : null}

      {menu ? (
        <MobileMenu
          brand={brand}
          directions={directions}
          servicesHref={servicesHref}
          calcHref={calcHref}
          links={links}
          contacts={contacts}
          onClose={() => {
            setMenu(false);
            burger.current?.focus();
          }}
        />
      ) : null}
    </header>
  );
}


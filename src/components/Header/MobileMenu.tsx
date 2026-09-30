'use client';

import { ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { NavDirection, NavLink, SiteContacts } from '@/site/nav';
import { ButtonLink } from '../Button/Button';

/** components/mobile-menu.md — во весь экран, аккордеон «Услуги», разделы 56px, низ: телефон, график, мессенджеры. */
export function MobileMenu({ brand, directions, servicesHref, calcHref, links, contacts, onClose }: { brand: string; directions: NavDirection[]; servicesHref: string; calcHref: string; links: NavLink[]; contacts: SiteContacts; onClose: () => void }) {
  const [services, setServices] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Фокус внутри меню, Esc закрывает, страница под меню не прокручивается.
  useEffect(() => {
    const root = box.current;
    root?.querySelector<HTMLElement>('button')?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !root) return;
      const els = [...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
      const first = els[0];
      const last = els.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const rowClasses = 'flex min-h-56 w-full items-center justify-between border-b border-border-default type-h3 font-regular text-text-default no-underline';

  return (
    <div ref={box} role="dialog" aria-modal="true" aria-label="Меню" className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg-default">
      <div className="flex h-header-height-mobile shrink-0 items-center justify-between border-b border-border-default page-x">
        <span className="font-heading text-22 font-semibold tracking-kicker uppercase">{brand}</span>
        <button type="button" onClick={onClose} aria-label="Закрыть меню" className="-mr-3 flex size-tap cursor-pointer items-center justify-center border-0 bg-transparent text-text-default">
          <X className="size-icon" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Разделы" className="flex flex-col page-x">
        <button type="button" aria-expanded={services} onClick={() => setServices((s) => !s)} className={cn(rowClasses, 'cursor-pointer border-x-0 border-t-0 bg-transparent px-0 text-left')}>
          Услуги
          <ChevronDown className={cn('size-icon text-accent-default transition-transform', services && 'rotate-180')} strokeWidth={1.5} aria-hidden="true" />
        </button>
        {services ? (
          <ul className="m-0 flex list-none flex-col border-b border-border-default p-0 py-2">
            {directions.map((d) => (
              <li key={d.id}>
                <a href={d.href} className="flex min-h-tap items-center justify-between type-body text-text-default no-underline">
                  {d.title}
                  <span className="type-small text-text-muted nums">{d.from}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={servicesHref} className="flex min-h-tap items-center type-body text-text-accent">
                Все услуги →
              </a>
            </li>
          </ul>
        ) : null}
        {links.map((l) => (
          <a key={l.href} href={l.href} className={rowClasses}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3 page-x py-6">
        <a href={`tel:${contacts.phone.tel}`} className="font-heading text-28 leading-tight text-text-default no-underline nums">
          {contacts.phone.display}
        </a>
        <span className="type-small text-text-muted">{contacts.hoursFull ?? contacts.hours}</span>
        <div className="flex flex-wrap gap-4">
          {contacts.messengers.map((m) => (
            <a key={m.href} href={m.href} className="type-body text-text-accent underline underline-offset-4">
              {m.label}
            </a>
          ))}
        </div>
        <ButtonLink href={calcHref} block>
          Рассчитать стоимость
        </ButtonLink>
      </div>
    </div>
  );
}

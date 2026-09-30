'use client';

import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteHeaderProps {
  logo: ReactNode;
  homeHref?: string;
  nav: NavLink[];
  phone: { display: string; tel: string };
  /** Для стори: меню открыто */
  defaultOpen?: boolean;
}

const iconButtonClasses = 'flex size-11 items-center justify-center text-text-primary';

export function SiteHeader({ logo, homeHref = '/', nav, phone, defaultOpen = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="border-b border-header-border bg-header-bg">
      <div className="mx-auto flex h-header-height max-w-6xl items-center justify-between gap-4 pr-2 pl-4 md:px-6">
        <a href={homeHref} className="flex items-center gap-3 text-text-primary no-underline">
          {logo}
        </a>
        <nav aria-label="Основное меню" className="hidden lg:block">
          <ul className="m-0 flex list-none gap-6 p-0">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-md text-text-primary no-underline hover:text-text-accent">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center">
          <a href={`tel:${phone.tel}`} aria-label={`Позвонить: ${phone.display}`} className={cn(iconButtonClasses, 'md:hidden')}>
            <Phone className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a href={`tel:${phone.tel}`} className="hidden font-semibold text-text-primary tabular-nums no-underline md:inline">
            {phone.display}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((o) => !o)}
            className={cn(iconButtonClasses, 'cursor-pointer border-0 bg-transparent lg:hidden')}
          >
            {open ? <X className="size-6" strokeWidth={1.75} aria-hidden="true" /> : <Menu className="size-6" strokeWidth={1.75} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav id={menuId} aria-label="Меню" hidden={!open} className="border-t border-header-border lg:hidden">
        <ul className="m-0 flex list-none flex-col p-0">
          {nav.map((l) => (
            <li key={l.href} className="border-b border-border-subtle">
              <a href={l.href} className="flex min-h-11 items-center px-4 text-lg text-text-primary no-underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/** Заглушка логотипа, пока нет бренда. */
export function LogoPlaceholder({ name }: { name: string }) {
  return (
    <>
      <span className="flex h-8 items-center justify-center border-2 border-border-strong px-1 font-code text-xs">ЛОГО</span>
      <span className="text-md font-semibold">{name}</span>
    </>
  );
}

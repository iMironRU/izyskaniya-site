'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import type { SiteContacts } from '@/site/nav';
import { Button } from '../Button/Button';

/**
 * components/contact-sheet.md — открывается только по нажатию «Связаться» (не попап):
 * mobile — нижняя шторка, desktop — боковая панель 420px. Внутри: телефон, мессенджеры, форма.
 */
export function ContactSheet({ title = 'Связаться', contacts, onClose, children }: { title?: string; contacts: SiteContacts; onClose: () => void; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-end">
      <button type="button" aria-label="Закрыть" tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-default border-0 bg-tint-ink" />
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-full w-full flex-col gap-4 overflow-y-auto rounded-t-lg border-t border-border-default bg-bg-default p-6 shadow-lg md:h-full md:w-contact-panel md:rounded-none md:border-t-0 md:border-l"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 type-h3">{title}</h2>
          <Button variant="secondary" icon aria-label="Закрыть" onClick={onClose}>
            <X className="size-icon" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
        <a href={`tel:${contacts.phone.tel}`} className="font-heading text-28 leading-tight text-text-default no-underline nums">
          {contacts.phone.display}
        </a>
        <p className="m-0 type-small text-text-muted">{contacts.hoursFull ?? contacts.hours}</p>
        <div className="flex flex-wrap gap-4">
          {contacts.messengers.map((m) => (
            <a key={m.href} href={m.href} className="type-body text-text-accent underline underline-offset-4">
              {m.label}
            </a>
          ))}
        </div>
        <div className="border-t border-border-default pt-4">{children}</div>
      </div>
    </div>
  );
}

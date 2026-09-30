'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Header, type HeaderProps } from '@/components/Header/Header';
import { StickyBar } from '@/components/StickyBar/StickyBar';
import { ToastProvider } from '@/components/Toast/Toast';

/** Шапка с текущим разделом и липкая панель: на калькуляторе своя панель, общая скрыта (sticky-bar.md). */
export function Shell({ header, calcHref, phoneTel, children, footer }: { header: Omit<HeaderProps, 'current'>; calcHref: string; phoneTel: string; children: ReactNode; footer: ReactNode }) {
  const path = usePathname();
  const onCalc = path?.startsWith('/raschet');
  return (
    <ToastProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-bg-default focus:p-2">
        К содержимому
      </a>
      <Header {...header} current={path ?? undefined} />
      <main id="main">{children}</main>
      {footer}
      {onCalc ? null : <StickyBar phoneTel={phoneTel} calcHref={calcHref} />}
    </ToastProvider>
  );
}

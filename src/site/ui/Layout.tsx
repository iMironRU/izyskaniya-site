import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Контейнер страницы: поля clamp(20px, 4.4vw, 56px), максимум 1280 (README хендоффа). */
export function Container({ children, narrow, className }: { children: ReactNode; narrow?: boolean; className?: string }) {
  return <div className={cn('mx-auto w-full page-x', narrow ? 'max-w-narrow' : 'max-w-page', className)}>{children}</div>;
}

/** Секция страницы: шаг clamp(40px, 5.5vw, 72px). */
export function Section({ id, children, className, label }: { id?: string; children: ReactNode; className?: string; label?: string }) {
  return (
    <section id={id} aria-label={label} className={cn('section-y', className)}>
      {children}
    </section>
  );
}

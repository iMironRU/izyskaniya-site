import { Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ButtonLink } from '../Button/Button';

/**
 * components/sticky-bar.md — липкая нижняя панель на мобильном (<768), высота 72px.
 * По умолчанию «Позвонить / Рассчитать»; калькулятор передаёт свои действия через children.
 */
export function StickyBar({ phoneTel, calcHref, children, inline }: { phoneTel?: string; calcHref?: string; children?: ReactNode; inline?: boolean }) {
  return (
    <div className={cn(inline ? 'relative' : 'fixed inset-x-0 bottom-0 z-20', 'flex min-h-sticky-bar-height items-center gap-3 border-t border-border-default bg-sticky-bar-bg px-4 pt-3 pb-safe md:hidden')}>
      {children ?? (
        <>
          <ButtonLink href={`tel:${phoneTel}`} variant="secondary" block className="flex-1" iconStart={<Phone className="size-16" strokeWidth={1.5} aria-hidden="true" />}>
            Позвонить
          </ButtonLink>
          <ButtonLink href={calcHref ?? '#'} block className="flex-1">
            Рассчитать
          </ButtonLink>
        </>
      )}
    </div>
  );
}

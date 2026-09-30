import { Phone } from 'lucide-react';

export interface StickyActionBarProps {
  phoneTel: string;
  actionHref: string;
  actionLabel?: string;
  /** Для стори: показать в потоке, а не закреплённой */
  inline?: boolean;
}

const baseButtonClasses = 'flex min-h-button-height-md items-center justify-center gap-2 px-3 text-md font-semibold no-underline';

export function StickyActionBar({ phoneTel, actionHref, actionLabel = 'Рассчитать программу', inline }: StickyActionBarProps) {
  return (
    <div
      className={`${inline ? 'relative' : 'fixed inset-x-0 bottom-0 z-10'} flex gap-3 border-t border-border-default bg-bg-page px-4 pt-3 pb-safe md:hidden`}
    >
      <a href={`tel:${phoneTel}`} className={`${baseButtonClasses} flex-1 border border-button-secondary-border bg-button-secondary-bg text-button-secondary-fg`}>
        <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
        Позвонить
      </a>
      <a href={actionHref} className={`${baseButtonClasses} flex-2 bg-button-primary-bg text-button-primary-fg hover:bg-button-primary-bg-hover`}>
        {actionLabel}
      </a>
    </div>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TrustItem {
  label: string;
  value: ReactNode;
}

/** components/trust-strip.md — 5 ячеек: СРО, лаборатория, год, объекты, рейтинг. Без горизонтальной прокрутки. */
export function TrustStrip({ items }: { items: TrustItem[] }) {
  return (
    <dl className="m-0 grid grid-cols-2 border-t border-border-strong md:grid-cols-5">
      {items.map((it, i) => (
        <div key={it.label} className={cn('flex flex-col gap-1 py-3 pr-3 md:pl-3', i % 2 === 1 && 'border-l border-border-default pl-3', i > 0 && 'md:border-l md:border-border-default', i === 0 && 'md:pl-0')}>
          <dt className="type-kicker text-text-muted">{it.label}</dt>
          <dd className="m-0 text-15 nums">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface KeyValueItem {
  term: string;
  value: ReactNode;
}

export function KeyValue({ items, columns = 1 }: { items: KeyValueItem[]; columns?: 1 | 2 }) {
  return (
    <dl className={cn('m-0 grid border-t border-border-strong', columns === 2 ? 'grid-cols-2 gap-x-4' : 'grid-cols-1')}>
      {items.map((it) => (
        <div key={it.term} className={cn('flex gap-1 border-b border-border-default py-3', columns === 2 ? 'flex-col' : 'flex-col md:flex-row md:gap-4')}>
          <dt className={cn('font-code text-xs tracking-wide text-text-secondary uppercase', columns === 1 && 'md:w-1/3 md:shrink-0')}>{it.term}</dt>
          <dd className="m-0 text-md leading-normal">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

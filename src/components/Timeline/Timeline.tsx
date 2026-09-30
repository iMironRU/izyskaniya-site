import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Tag } from '../Primitives/Primitives';

export interface TimelineItem {
  title: string;
  text?: ReactNode;
  term?: string;
  tag?: string;
  you?: ReactNode;
  price?: ReactNode;
  photo?: ReactNode;
}

/**
 * components/timeline.md — этапы: верхняя линия 2px gold, номер, срок, название, описание.
 * Сетка auto-fit minmax(190px): на десктопе горизонтально, на телефоне сама становится вертикальной.
 */
export function Timeline({ items, rule = 'accent' }: { items: TimelineItem[]; rule?: 'accent' | 'strong' }) {
  return (
    <ol className={cn('m-0 grid-auto-timeline grid list-none gap-x-6 p-0', rule === 'strong' && 'border-t border-border-strong')}>
      {items.map((it, i) => (
        <li key={it.title} className={cn('flex flex-col gap-2 border-b border-border-default py-4', rule === 'accent' && 'border-t-2 border-t-accent-default')}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-heading text-20 text-text-accent nums">{String(i + 1).padStart(2, '0')}</span>
            {it.term ? <span className="type-small text-text-muted nums">{it.term}</span> : null}
          </div>
          {it.tag ? (
            <span className="self-start">
              <Tag tone={it.tag.startsWith('обяз') ? 'accent' : 'neutral'}>{it.tag}</Tag>
            </span>
          ) : null}
          {it.photo}
          <h3 className="m-0 type-title-card">{it.title}</h3>
          {it.text ? <p className="m-0 type-body text-text-secondary">{it.text}</p> : null}
          {it.you ? (
            <p className="m-0 type-small text-text-muted">
              <span className="type-kicker text-text-accent">От вас: </span>
              {it.you}
            </p>
          ) : null}
          {it.price ? <p className="m-0 type-small nums">{it.price}</p> : null}
        </li>
      ))}
    </ol>
  );
}

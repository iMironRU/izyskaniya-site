'use client';

import { useMemo, useState } from 'react';
import { ArrowLink } from '@/components/Primitives/Primitives';
import { FilterChips } from '@/components/SectionChips/SectionChips';
import { cn } from '@/lib/cn';

export interface DirectionRow {
  id: string;
  title: string;
  text: string;
  from: string;
  days: string;
  href: string;
  tasks: string[];
  services: Array<{ label: string; href: string; price?: string }>;
}

/** Фильтр по задаче поднимает подходящие направления наверх, остальные — 50 % (pages/uslugi.md). */
export function Directions({ items, tasks }: { items: DirectionRow[]; tasks: Array<{ value: string; label: string }> }) {
  const [task, setTask] = useState('all');
  const ordered = useMemo(() => {
    if (task === 'all') return items.map((d) => ({ d, on: true }));
    return [...items.filter((d) => d.tasks.includes(task)).map((d) => ({ d, on: true })), ...items.filter((d) => !d.tasks.includes(task)).map((d) => ({ d, on: false }))];
  }, [items, task]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="m-0 type-kicker text-text-muted">Ваша задача</p>
        <FilterChips name="task" label="Ваша задача" value={task} onChange={setTask} options={tasks} />
      </div>
      <ul className="m-0 flex list-none flex-col border-t border-border-strong p-0">
        {ordered.map(({ d, on }) => (
          <li key={d.id} id={d.id} className={cn('grid gap-4 border-b border-border-default py-6 md:grid-cols-3', !on && 'opacity-dimmed')}>
            <div className="flex flex-col gap-2">
              <h2 className="m-0 type-h3">{d.title}</h2>
              <p className="m-0 type-body text-text-secondary">{d.text}</p>
            </div>
            <dl className="m-0 flex gap-8">
              <div>
                <dt className="type-kicker text-text-muted">Цена</dt>
                <dd className="m-0 font-heading text-22 nums">{d.from}</dd>
              </div>
              <div>
                <dt className="type-kicker text-text-muted">Срок</dt>
                <dd className="m-0 font-heading text-22 nums">{d.days}</dd>
              </div>
            </dl>
            <div className="flex flex-col gap-2">
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {d.services.map((s) => (
                  <li key={s.label} className="flex items-baseline justify-between gap-3 type-small">
                    <a href={s.href} className="text-text-default underline decoration-border-default underline-offset-4 hover:text-text-accent-strong">
                      {s.label}
                    </a>
                    {s.price ? <span className="shrink-0 text-text-muted nums">{s.price}</span> : null}
                  </li>
                ))}
              </ul>
              <ArrowLink href={d.href}>Всё о направлении</ArrowLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

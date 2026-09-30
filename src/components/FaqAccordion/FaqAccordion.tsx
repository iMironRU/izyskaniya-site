'use client';

import { Plus, Search } from 'lucide-react';
import { useId, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { EmptyState } from '../Primitives/Primitives';
import { FilterChips } from '../SectionChips/SectionChips';

export interface FaqItem {
  q: string;
  a: ReactNode;
  /** Текст ответа для поиска, если a — не строка */
  text?: string;
  group?: string;
}

/**
 * components/faq-accordion.md — вопрос-кнопка, «+» → «×» поворотом 45°, открыт один.
 * Варианты: с поиском, с разделами-чипами.
 */
export function FaqAccordion({ items, search, groups, defaultOpen = 0, name = 'faq' }: { items: FaqItem[]; search?: boolean; groups?: string[]; defaultOpen?: number | null; name?: string }) {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => group === 'all' || it.group === group)
      .filter(({ it }) => !q || `${it.q} ${it.text ?? (typeof it.a === 'string' ? it.a : '')}`.toLowerCase().includes(q));
  }, [items, query, group]);

  return (
    <div className="flex flex-col gap-4">
      {search ? (
        <label className="relative flex items-center">
          <span className="sr-only">Поиск по вопросам</span>
          <Search className="pointer-events-none absolute left-2 size-icon text-text-muted" strokeWidth={1.5} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например: зимой, экспертиза, цена"
            className="min-h-input-height w-full rounded-input border border-input-border bg-transparent pr-3 pl-32 text-input hover:border-border-input-hover focus-visible:border-input-border-focus"
          />
        </label>
      ) : null}
      {groups?.length ? (
        <FilterChips name={`${name}-groups`} label="Разделы" value={group} onChange={setGroup} options={[{ value: 'all', label: 'Все' }, ...groups.map((g) => ({ value: g, label: g }))]} />
      ) : null}

      {shown.length === 0 ? (
        <EmptyState
          text="Такого вопроса пока нет. Задайте его инженеру — ответим в рабочее время."
          action={
            <button type="button" onClick={() => setQuery('')} className="cursor-pointer border-0 bg-transparent p-0 type-body text-text-accent underline underline-offset-4">
              Сбросить поиск
            </button>
          }
        />
      ) : (
        <div className="border-t border-border-strong">
          {shown.map(({ it, i }) => {
            const isOpen = open === i;
            const bid = `${uid}-b${i}`;
            const pid = `${uid}-p${i}`;
            return (
              <div key={it.q} className="border-b border-border-default">
                <h3 className="m-0">
                  <button
                    id={bid}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={pid}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-tap w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-3 text-left font-heading text-20 leading-heading font-semibold text-text-default hover:text-text-accent-strong"
                  >
                    {it.q}
                    <Plus className={cn('size-icon shrink-0 text-accent-default transition-transform', isOpen && 'rotate-45')} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </h3>
                <div id={pid} role="region" aria-labelledby={bid} hidden={!isOpen} className="pb-4 type-body text-text-secondary">
                  {it.a}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

export interface Chip {
  id: string;
  label: string;
}

const chipClasses = 'inline-flex min-h-8 cursor-pointer items-center rounded-sm px-3 text-14 no-underline';
const chipStateClasses = (active: boolean) =>
  active ? 'bg-bg-tint text-text-accent-strong' : 'bg-tag-neutral-bg text-tag-neutral-text hover:text-text-accent-strong';

/**
 * components/section-chips.md — навигация по разделам длинной страницы.
 * Плавная прокрутка с отступом 80px (scroll-padding в globals.css). Текущий раздел — по прокрутке.
 */
export function SectionChips({ sections, label = 'Разделы страницы' }: { sections: Chip[]; label?: string }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length || !('IntersectionObserver' in window)) return;
    // Отступ под шапку берём из scroll-padding-top (токен scroll-offset), чтобы не дублировать число.
    const offset = getComputedStyle(document.documentElement).scrollPaddingTop || '0';
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setCurrent(top.target.id);
      },
      { rootMargin: `-${offset} 0% -60% 0%` },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label={label}>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} aria-current={current === s.id ? 'location' : undefined} className={cn(chipClasses, chipStateClasses(current === s.id))}>
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Чипы-фильтр: нативные радиокнопки (стрелки работают сами). */
export function FilterChips<T extends string>({ name, options, value, onChange, label }: { name: string; options: Array<{ value: T; label: string }>; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="sr-only">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className={cn(chipClasses, chipStateClasses(value === o.value), 'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring')}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

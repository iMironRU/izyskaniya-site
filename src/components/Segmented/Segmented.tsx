'use client';

import { cn } from '@/lib/cn';

/** components/radio-checkbox.md — сегментный переключатель (.seg): нативные радиокнопки. */
export function Segmented<T extends string>({ name, label, options, value, onChange, block }: { name: string; label: string; options: Array<{ value: T; label: string }>; value: T; onChange: (v: T) => void; block?: boolean }) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="sr-only">{label}</legend>
      <div className={cn('inline-flex overflow-hidden rounded-md border border-border-default', block && 'flex w-full')}>
        {options.map((o, i) => {
          const on = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                'inline-flex min-h-tap cursor-pointer items-center justify-center px-3 text-14 has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-focus-ring',
                block && 'flex-1',
                i > 0 && 'border-l border-border-default',
                on ? 'text-text-accent-strong inset-ring inset-ring-accent-default' : 'text-text-default hover:bg-tint-ink',
              )}
            >
              <input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Option {
  value: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
  /** Вариант «Не знаю»: пунктирная рамка */
  unknown?: boolean;
  disabled?: boolean;
}

interface OptionTileProps extends Option {
  name: string;
  type: 'radio' | 'checkbox';
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}

const tileClasses =
  'group relative flex min-h-tile-min-height cursor-pointer items-center gap-3 border border-tile-border bg-tile-bg px-4 py-3 text-text-primary transition-colors hover:border-tile-border-hover hover:bg-tile-bg-hover has-checked:border-tile-border-selected has-checked:bg-tile-bg-selected has-checked:ring-1 has-checked:ring-tile-border-selected has-checked:ring-inset has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring has-disabled:cursor-not-allowed has-disabled:text-text-disabled has-disabled:hover:border-tile-border has-disabled:hover:bg-tile-bg';

const indicatorClasses =
  'flex size-5 shrink-0 items-center justify-center border-2 border-tile-indicator group-has-checked:border-tile-indicator-selected';

export function OptionTile({ name, type, value, label, hint, icon, unknown, disabled, checked, onChange }: OptionTileProps) {
  return (
    <label className={cn(tileClasses, unknown && 'border-dashed')}>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(value, e.target.checked)}
        className="sr-only"
      />
      <span aria-hidden="true" className={cn(indicatorClasses, type === 'radio' ? 'rounded-full' : 'rounded-sm')}>
        <span className={cn('hidden size-2 bg-tile-indicator-selected group-has-checked:block', type === 'radio' ? 'rounded-full' : 'rounded-none')} />
      </span>
      {icon ? <span className="flex shrink-0 text-text-accent">{icon}</span> : null}
      <span className="flex flex-col gap-1">
        <span className="text-lg leading-snug font-semibold">{label}</span>
        {hint ? <span className="text-sm leading-snug text-text-secondary group-has-disabled:text-text-disabled">{hint}</span> : null}
      </span>
    </label>
  );
}

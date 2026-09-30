'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { AssumptionBadge } from '../Primitives/Primitives';

export interface Option {
  value: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
  /** Вариант «Не знаю»: пунктирная точка и бейдж «по умолчанию» */
  unknown?: boolean;
  disabled?: boolean;
}

interface OptionTileProps extends Option {
  name: string;
  type: 'radio' | 'checkbox';
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}

// components/option-tile.md
const tileClasses =
  'group relative flex min-h-option-tile-min-height cursor-pointer items-start gap-3 rounded-md border border-option-tile-border p-option-tile text-text-default hover:border-option-tile-border-selected has-checked:border-option-tile-border-selected has-checked:bg-option-tile-bg-selected has-checked:inset-ring has-checked:inset-ring-option-tile-border-selected has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring has-disabled:cursor-not-allowed has-disabled:opacity-disabled has-disabled:hover:border-option-tile-border';

export function OptionTile({ name, type, value, label, hint, icon, unknown, disabled, checked, onChange }: OptionTileProps) {
  return (
    <label className={tileClasses}>
      <input type={type} name={name} value={value} checked={checked} disabled={disabled} onChange={(e) => onChange(value, e.target.checked)} className="sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'mt-1 flex size-option-tile-radio-size shrink-0 items-center justify-center border-2 border-text-muted group-has-checked:border-accent-default',
          type === 'radio' ? 'rounded-full' : 'rounded-sm',
          unknown && 'border-dashed',
        )}
      >
        <span className={cn('hidden size-2 bg-accent-default group-has-checked:block', type === 'radio' ? 'rounded-full' : 'rounded-none')} />
      </span>
      {icon ? <span className="flex shrink-0 text-accent-default">{icon}</span> : null}
      <span className="flex flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-20 leading-heading font-semibold">{label}</span>
          {unknown ? <AssumptionBadge>по умолчанию</AssumptionBadge> : null}
        </span>
        {hint ? <span className="type-small text-text-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

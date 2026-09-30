import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * components/calc-progress.md — подпись ветки, «Шаг N из M», сегменты:
 * пройден — gold 2px, текущий — accent-700 2px, впереди — neutral-500 1px.
 */
export function CalcProgress({ step, total, branch, note }: { step: number; total: number; branch?: string; note?: ReactNode }) {
  const text = `Шаг ${step} из ${total}`;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="type-kicker text-text-accent">
          {branch}
          {note ? <span className="hidden md:inline"> · {note}</span> : null}
        </span>
        <span className="shrink-0 type-small whitespace-nowrap text-text-muted nums" aria-hidden="true">
          {text}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-valuetext={text}
        aria-label={branch ? `${branch}: ${text}` : text}
        className="flex h-progress-segment-height items-center gap-1"
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn('flex-1', i + 1 < step && 'border-t-2 border-progress-done', i + 1 === step && 'border-t-2 border-progress-current', i + 1 > step && 'border-t border-progress-todo')}
          />
        ))}
      </div>
    </div>
  );
}

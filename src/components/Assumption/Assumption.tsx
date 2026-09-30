import type { ReactNode } from 'react';

export function AssumptionBadge({ children = 'Принято по умолчанию' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center bg-accent-default px-2 py-1 font-code text-xs leading-tight tracking-wide text-text-inverse uppercase">
      {children}
    </span>
  );
}

export function AssumptionNote({ badge, children }: { badge?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 border border-assumption-border bg-assumption-bg p-3 text-assumption-fg">
      <AssumptionBadge>{badge}</AssumptionBadge>
      <div className="text-md leading-normal">{children}</div>
    </div>
  );
}

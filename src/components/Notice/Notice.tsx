import { CircleAlert, CircleCheck, Info, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type NoticeTone = 'success' | 'error' | 'offline' | 'info';

const toneClasses: Record<NoticeTone, string> = {
  success: 'border-status-success bg-status-success-subtle',
  error: 'border-status-error bg-status-error-subtle',
  offline: 'border-border-strong bg-bg-subtle',
  info: 'border-border-default bg-bg-surface',
};

const iconClasses: Record<NoticeTone, string> = {
  success: 'text-status-success',
  error: 'text-status-error',
  offline: 'text-text-primary',
  info: 'text-text-accent',
};

const icons = { success: CircleCheck, error: CircleAlert, offline: WifiOff, info: Info };

export function Notice({ tone, title, children, action }: { tone: NoticeTone; title: string; children?: ReactNode; action?: ReactNode }) {
  const Icon = icons[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 border p-4', toneClasses[tone])}>
      <Icon className={cn('size-6 shrink-0', iconClasses[tone])} strokeWidth={1.75} aria-hidden="true" />
      <div className="flex flex-col items-start gap-2">
        <p className="m-0 text-lg font-semibold">{title}</p>
        {children ? <div className="text-md leading-normal">{children}</div> : null}
        {action}
      </div>
    </div>
  );
}

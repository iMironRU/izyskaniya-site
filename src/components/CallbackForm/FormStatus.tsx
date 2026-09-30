import { CircleAlert, CircleCheck, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type StatusTone = 'success' | 'error' | 'offline' | 'info';
const icons = { success: CircleCheck, error: CircleAlert, offline: WifiOff, info: CircleAlert };

/**
 * Состояние формы на месте формы (не попап). Моно-схема README хендоффа:
 * ошибка — рамка gold + текст accent-800 + иконка + формулировка, без красного.
 */
export function FormStatus({ tone, title, children, action }: { tone: StatusTone; title: string; children?: ReactNode; action?: ReactNode }) {
  const Icon = icons[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-md border p-4', tone === 'info' ? 'border-border-default' : 'border-status-error-border')}>
      <Icon className={cn('size-icon-lg shrink-0', tone === 'error' ? 'text-status-error' : 'text-accent-default')} strokeWidth={1.5} aria-hidden="true" />
      <div className="flex flex-col items-start gap-2">
        <p className={cn('m-0 type-title-card', tone === 'error' && 'text-status-error')}>{title}</p>
        {children ? <div className="type-body text-text-secondary">{children}</div> : null}
        {action}
      </div>
    </div>
  );
}

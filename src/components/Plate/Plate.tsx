import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type PlateRatio = '3/4' | '4/5' | '4/3' | '16/9' | '1/1';
const ratioClasses: Record<PlateRatio, string> = {
  '3/4': 'aspect-3/4',
  '4/5': 'aspect-4/5',
  '4/3': 'aspect-4/3',
  '16/9': 'aspect-16/9',
  '1/1': 'aspect-square',
};

/**
 * components/plate.md — фото/скан «вклеен» в страницу: мат 6px, контур, тёплая тонировка.
 * Без img — заглушка со штриховкой 45° и подписью «Заглушка · …» (фото пока нет).
 */
export function Plate({ src, alt = '', label, ratio = '4/3', children, className }: { src?: string; alt?: string; label?: string; ratio?: PlateRatio; children?: ReactNode; className?: string }) {
  const id = useId();
  return (
    <div className={cn('rounded-sm border border-plate-outline bg-plate-mat-color p-plate-mat', className)}>
      <div className={cn('relative overflow-hidden bg-bg-default', ratioClasses[ratio])}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- статический экспорт, без оптимизатора
          <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
        ) : children ? (
          children
        ) : (
          <>
            <svg className="absolute inset-0 size-full text-accent-default" aria-hidden="true">
              <defs>
                <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="7" height="14" fill="currentColor" fillOpacity="0.08" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#${id})`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center p-4 text-center type-kicker text-text-muted">Заглушка · {label}</span>
          </>
        )}
      </div>
    </div>
  );
}

import { cn } from '@/lib/cn';

export interface QuizProgressProps {
  /** Текущий вопрос, с 1 */
  current: number;
  total: number;
  section?: string;
}

export function QuizProgress({ current, total, section }: QuizProgressProps) {
  const label = `Вопрос ${current} из ${total}`;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{section}</span>
        <span className="font-code text-text-secondary" aria-hidden="true">
          {current} из {total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={label}
        aria-label={section ? `${section}: ${label}` : label}
        className="flex gap-1"
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-progress-height flex-1',
              i + 1 < current && 'bg-progress-done',
              i + 1 === current && 'bg-progress-current',
              i + 1 > current && 'bg-progress-track',
            )}
          />
        ))}
      </div>
    </div>
  );
}

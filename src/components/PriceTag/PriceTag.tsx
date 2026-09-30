import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/format';

export type PriceTagProps =
  | { kind: 'exact'; total: number; size?: 'sm' | 'lg'; note?: string }
  | { kind: 'range'; min: number; max: number; size?: 'sm' | 'lg'; note?: string }
  | { kind: 'from'; value: number; size?: 'sm' | 'lg'; note?: string };

export function PriceTag(props: PriceTagProps) {
  const { size = 'sm', note } = props;
  const text =
    props.kind === 'exact'
      ? formatMoney(props.total)
      : props.kind === 'range'
        ? `от ${formatMoney(props.min)} до ${formatMoney(props.max)}`
        : `от ${formatMoney(props.value)}`;
  return (
    <span className="inline-flex flex-col gap-1">
      <span className={cn('tabular-nums', size === 'lg' ? 'font-display text-4xl leading-tight font-bold' : 'text-md font-semibold')}>
        {text}
      </span>
      {note ? <span className="text-sm text-text-secondary">{note}</span> : null}
    </span>
  );
}

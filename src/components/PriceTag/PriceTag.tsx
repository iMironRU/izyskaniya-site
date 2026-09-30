import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/format';

export type PriceTagProps =
  | { kind: 'exact'; total: number; size?: 'sm' | 'lg'; note?: string }
  | { kind: 'range'; min: number; max: number; size?: 'sm' | 'lg'; note?: string }
  | { kind: 'from'; value: number; size?: 'sm' | 'lg'; note?: string };

/** Цена: число всегда приходит из движка (src/engine), в вёрстке цифр нет. */
export function PriceTag(props: PriceTagProps) {
  const { size = 'sm', note } = props;
  const text =
    props.kind === 'exact'
      ? formatMoney(props.total)
      : props.kind === 'range'
        ? `${formatMoney(props.min)} — ${formatMoney(props.max)}`
        : `от ${formatMoney(props.value)}`;
  return (
    <span className="inline-flex flex-col gap-1">
      <span className={cn('nums', size === 'lg' ? 'type-figure' : 'text-15')}>{text}</span>
      {note ? <span className="type-small text-text-muted">{note}</span> : null}
    </span>
  );
}

'use client';

import { cn } from '@/lib/cn';
import { OptionTile, type Option } from './OptionTile';

interface BaseProps {
  name: string;
  legend: string;
  /** Скрыть легенду визуально (текст вопроса уже в заголовке экрана) */
  legendHidden?: boolean;
  options: Option[];
  layout?: 'list' | 'grid';
}

type SingleProps = BaseProps & { mode?: 'single'; value: string | null; onChange: (value: string) => void };
type MultiProps = BaseProps & { mode: 'multi'; value: string[]; onChange: (value: string[]) => void };

export type OptionGroupProps = SingleProps | MultiProps;

export function OptionGroup(props: OptionGroupProps) {
  const { name, legend, legendHidden, options, layout = 'list' } = props;
  const isMulti = props.mode === 'multi';

  const isChecked = (v: string) => (isMulti ? props.value.includes(v) : props.value === v);
  const handle = (v: string, checked: boolean) => {
    if (props.mode === 'multi') {
      props.onChange(checked ? [...props.value, v] : props.value.filter((x) => x !== v));
    } else {
      props.onChange(v);
    }
  };

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className={cn('mb-3 type-h3', legendHidden && 'sr-only')}>{legend}</legend>
      <div className={cn('grid grid-cols-1 gap-2', layout === 'grid' && 'md:grid-cols-2')}>
        {options.map((o) => (
          <OptionTile
            key={o.value}
            {...o}
            name={name}
            type={isMulti ? 'checkbox' : 'radio'}
            checked={isChecked(o.value)}
            onChange={handle}
          />
        ))}
      </div>
    </fieldset>
  );
}

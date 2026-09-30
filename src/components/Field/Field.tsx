'use client';

import { CircleAlert } from 'lucide-react';
import { useId, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { formatCadastral, formatPhone } from '@/lib/format';

interface FieldProps {
  label: string;
  /** Подпись только для скринридера: вопрос уже в заголовке экрана */
  labelHidden?: boolean;
  hint?: ReactNode;
  error?: string;
  /** Единица измерения справа от поля: «м», «га», «км» */
  unit?: string;
  children: (a11y: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode;
}

const controlClasses =
  'h-field-height w-full min-w-0 border border-field-border bg-field-bg px-3 font-body text-lg text-text-primary placeholder:text-text-disabled hover:border-field-border-hover focus-visible:border-field-border-focus disabled:cursor-not-allowed disabled:bg-field-bg-disabled aria-invalid:border-field-border-error';

export function Field({ label, labelHidden, hint, error, unit, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const control = children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined });

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={cn('text-md font-semibold', labelHidden && 'sr-only')}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="m-0 text-sm leading-normal text-text-secondary">
          {hint}
        </p>
      ) : null}
      {unit ? (
        <div className="flex">
          {control}
          <span className="flex h-field-height shrink-0 items-center border border-l-0 border-field-border bg-field-addon-bg px-3 text-md text-text-secondary">
            {unit}
          </span>
        </div>
      ) : (
        control
      )}
      {error ? (
        <p id={errorId} className="m-0 flex items-center gap-2 text-sm text-status-error">
          <CircleAlert className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
  label: string;
  labelHidden?: boolean;
  hint?: ReactNode;
  error?: string;
};

function withFormat(format: (s: string) => string, onChange?: (e: ChangeEvent<HTMLInputElement>) => void) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = format(e.target.value);
    onChange?.(e);
  };
}

export function TextField({ label, labelHidden, hint, error, className, ...input }: InputProps) {
  return (
    <Field label={label} labelHidden={labelHidden} hint={hint} error={error}>
      {(a11y) => <input type="text" {...input} {...a11y} className={cn(controlClasses, className)} />}
    </Field>
  );
}

export function NumberField({ label, labelHidden, hint, error, unit, className, ...input }: InputProps & { unit: string }) {
  return (
    <Field label={label} labelHidden={labelHidden} hint={hint} error={error} unit={unit}>
      {(a11y) => (
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          {...input}
          {...a11y}
          className={cn(controlClasses, 'text-right tabular-nums', className)}
        />
      )}
    </Field>
  );
}

export function PhoneField({ label, labelHidden, hint, error, className, onChange, ...input }: InputProps) {
  return (
    <Field label={label} labelHidden={labelHidden} hint={hint} error={error}>
      {(a11y) => (
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          {...input}
          {...a11y}
          onChange={withFormat(formatPhone, onChange)}
          className={cn(controlClasses, 'tabular-nums', className)}
        />
      )}
    </Field>
  );
}

export function CadastralField({ label, labelHidden, hint, error, className, onChange, ...input }: InputProps) {
  return (
    <Field label={label} labelHidden={labelHidden} hint={hint} error={error}>
      {(a11y) => (
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          placeholder="56:44:0301001:123"
          {...input}
          {...a11y}
          onChange={withFormat(formatCadastral, onChange)}
          className={cn(controlClasses, 'font-code tabular-nums', className)}
        />
      )}
    </Field>
  );
}

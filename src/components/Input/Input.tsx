'use client';

import { CircleAlert } from 'lucide-react';
import { useId, type ChangeEvent, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { formatCadastral, formatPhone } from '@/lib/format';

interface FieldProps {
  label: string;
  labelHidden?: boolean;
  hint?: ReactNode;
  error?: string;
  unit?: string;
  children: (a11y: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode;
}

// components/input.md: высота 52, шрифт 17–22 tabular; hover — neutral-600; focus — gold; error — gold + текст accent-800.
export const controlClasses =
  'min-h-input-height w-full min-w-0 rounded-input border border-input-border bg-transparent px-3 font-body text-input text-text-default caret-accent-default placeholder:text-text-muted hover:border-border-input-hover focus-visible:border-input-border-focus focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-disabled aria-invalid:border-input-border-error';

export function Field({ label, labelHidden, hint, error, unit, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const control = children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined });

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={cn('type-small text-text-secondary', labelHidden && 'sr-only')}>
        {label}
      </label>
      {unit ? (
        <div className="relative flex items-center">
          {control}
          <span aria-hidden="true" className="pointer-events-none absolute right-3 text-input text-input-unit-color">
            {unit}
          </span>
        </div>
      ) : (
        control
      )}
      {hint ? (
        <p id={hintId} className="m-0 type-small text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="m-0 flex items-center gap-2 type-small text-status-error">
          <CircleAlert className="size-16 shrink-0" strokeWidth={1.5} aria-hidden="true" />
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
      {(a11y) => <input type="text" inputMode="decimal" autoComplete="off" {...input} {...a11y} className={cn(controlClasses, 'pr-12 nums', className)} />}
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
          className={cn(controlClasses, 'nums', className)}
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
          placeholder="66:41:0000000:000"
          {...input}
          {...a11y}
          onChange={withFormat(formatCadastral, onChange)}
          className={cn(controlClasses, 'nums', className)}
        />
      )}
    </Field>
  );
}

export function TextAreaField({ label, labelHidden, hint, error, className, ...input }: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & { label: string; labelHidden?: boolean; hint?: ReactNode; error?: string }) {
  return (
    <Field label={label} labelHidden={labelHidden} hint={hint} error={error}>
      {(a11y) => <textarea rows={4} {...input} {...a11y} className={cn(controlClasses, 'resize-y py-3', className)} />}
    </Field>
  );
}

/** components/radio-checkbox.md — нативный чекбокс с подписью. */
export function Checkbox({ label, checked, onChange, error, children }: { label?: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children?: ReactNode }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex min-h-tap cursor-pointer items-start gap-3 type-small text-text-secondary">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-e` : undefined}
          className="mt-1 size-option-tile-radio-size shrink-0 accent-accent-default"
        />
        <span>{children ?? label}</span>
      </label>
      {error ? (
        <p id={`${id}-e`} className="m-0 type-small text-status-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

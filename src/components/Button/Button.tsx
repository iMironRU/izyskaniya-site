import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Растянуть на всю ширину контейнера */
  block?: boolean;
  /** Показать индикатор и заблокировать нажатие */
  loading?: boolean;
  children: ReactNode;
}

// Классы — обычные строки, чтобы Onlook мог править их прямо в TSX.
const baseClasses =
  'inline-flex items-center justify-center gap-2 px-button-padding-x font-body font-semibold text-md transition-colors cursor-pointer disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-button-primary-bg text-button-primary-fg hover:bg-button-primary-bg-hover active:bg-button-primary-bg-active disabled:bg-button-disabled-bg disabled:text-button-disabled-fg',
  secondary:
    'border border-button-secondary-border bg-button-secondary-bg text-button-secondary-fg hover:bg-button-secondary-bg-hover disabled:border-border-default disabled:bg-button-disabled-bg disabled:text-button-disabled-fg',
  text: 'px-0 text-button-text-fg underline-offset-4 hover:text-button-text-fg-hover hover:underline disabled:text-button-disabled-fg',
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-button-height-md',
  lg: 'min-h-button-height-lg text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[baseClasses, variantClasses[variant], sizeClasses[size], block ? 'w-full' : '', className ?? ''].join(' ').trim()}
      {...rest}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

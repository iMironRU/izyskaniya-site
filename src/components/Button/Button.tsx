import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface Common {
  variant?: ButtonVariant;
  /** Компактная высота 40px (шапка desktop) */
  compact?: boolean;
  /** На всю ширину — мобильные панели */
  block?: boolean;
  /** Квадратная кнопка 44×44 только с иконкой; обязателен aria-label */
  icon?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
}

// components/button.md. Основная — контур акцентом, без заливки.
const baseClasses =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-button border font-heading text-16 leading-tight font-semibold no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-disabled aria-disabled:cursor-not-allowed aria-disabled:opacity-disabled';

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'border-button-primary-border text-button-primary-text hover:bg-button-primary-bg-hover active:bg-button-primary-bg-active',
  secondary: 'border-button-secondary-border text-button-secondary-text hover:bg-button-secondary-bg-hover active:bg-tint-ink',
  ghost: 'border-transparent text-button-ghost-text hover:bg-button-ghost-bg-hover',
};

export function buttonClasses({ variant = 'primary', compact, block, icon }: Omit<Common, 'children' | 'iconStart' | 'iconEnd'>) {
  return cn(
    baseClasses,
    buttonVariantClasses[variant],
    icon ? 'size-tap px-0' : 'px-button-padding-x',
    !icon && (compact ? 'min-h-button-height-compact text-14' : 'min-h-button-height'),
    block && 'w-full',
  );
}

export type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export function Button({ variant, compact, block, icon, iconStart, iconEnd, loading, disabled, type = 'button', className, children, ...rest }: ButtonProps) {
  return (
    <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={cn(buttonClasses({ variant, compact, block, icon }), className)} {...rest}>
      {iconStart}
      {loading ? 'Отправляем…' : children}
      {iconEnd}
    </button>
  );
}

export type ButtonLinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function ButtonLink({ variant, compact, block, icon, iconStart, iconEnd, className, children, ...rest }: ButtonLinkProps) {
  return (
    <a className={cn(buttonClasses({ variant, compact, block, icon }), className)} {...rest}>
      {iconStart}
      {children}
      {iconEnd}
    </a>
  );
}

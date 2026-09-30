// Мелкие компоненты из хендоффа: arrow-link, breadcrumbs, section-heading, lead,
// fact-figure, tag, callout, norm-link, norm-quote, assumption-badge, empty-state, skeleton, rating.
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** components/arrow-link.md — «Все услуги →». */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-1 text-14 text-text-accent underline decoration-border-default underline-offset-4 hover:text-text-accent-strong hover:decoration-current',
        className,
      )}
    >
      {children}
      <ArrowRight className="size-16 shrink-0" strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}

export interface Crumb {
  href?: string;
  label: string;
}

/** components/breadcrumbs.md — на всех страницах, кроме главной. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="type-small text-text-muted">
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {c.href && i < items.length - 1 ? (
              <a href={c.href} className="underline decoration-border-default underline-offset-4 hover:text-text-default hover:decoration-current">
                {c.label}
              </a>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** components/section-heading.md — h2 + подзаголовок + ссылка справа. */
export function SectionHeading({
  title,
  sub,
  link,
  rule,
  id,
  as: As = 'h2',
}: {
  title: ReactNode;
  sub?: ReactNode;
  link?: { href: string; label: string };
  rule?: boolean;
  id?: string;
  as?: 'h2' | 'h3';
}) {
  return (
    <div className={cn('flex flex-col gap-2', rule && 'border-t border-border-strong pt-6')}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <As id={id} className={cn('m-0 text-text-default', As === 'h2' ? 'type-h2' : 'type-h3')}>
          {title}
        </As>
        {link ? <ArrowLink href={link.href}>{link.label}</ArrowLink> : null}
      </div>
      {sub ? <p className="m-0 type-body text-text-secondary">{sub}</p> : null}
    </div>
  );
}

/** components/lead.md */
export function Lead({ children, justify, className }: { children: ReactNode; justify?: boolean; className?: string }) {
  return <p className={cn('m-0 max-w-measure type-lead text-text-secondary', justify && 'text-justify hyphens-auto', className)}>{children}</p>;
}

/** Кикер над заголовком: UPPERCASE, акцент. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('m-0 type-kicker text-text-accent', className)}>{children}</p>;
}

/** components/fact-figure.md — число Cormorant + подпись. */
export function FactFigure({ value, label, divider }: { value: ReactNode; label: ReactNode; divider?: boolean }) {
  return (
    <div className={cn('flex flex-col gap-1', divider && 'border-l border-border-default pl-4')}>
      <span className="type-figure text-text-default">{value}</span>
      <span className="type-small text-text-muted">{label}</span>
    </div>
  );
}

/** Тег: accent / neutral / outline (styles.css .tag-*). */
export function Tag({ tone = 'neutral', children }: { tone?: 'accent' | 'neutral' | 'outline'; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm p-tag text-tag leading-tight tracking-label',
        tone === 'accent' && 'bg-tag-accent-bg text-tag-accent-text',
        tone === 'neutral' && 'bg-tag-neutral-bg text-tag-neutral-text',
        tone === 'outline' && 'border border-accent-default text-text-accent',
      )}
    >
      {children}
    </span>
  );
}

/** components/assumption-badge.md — «принято по умолчанию» рядом со значением. */
export function AssumptionBadge({ children = 'принято по умолчанию' }: { children?: ReactNode }) {
  return <Tag tone="accent">{children}</Tag>;
}

/** components/callout.md — «Важно» / «Плохой знак». Только линия слева, без заливки. */
export function Callout({ kind = 'important', label, children }: { kind?: 'important' | 'bad-sign'; label?: string; children: ReactNode }) {
  return (
    <aside className="flex flex-col gap-1 border-l-2 border-border-accent py-1 pl-4">
      <p className="m-0 type-kicker text-text-accent">{label ?? (kind === 'bad-sign' ? 'Плохой знак' : 'Важно')}</p>
      <div className="type-body text-text-default">{children}</div>
    </aside>
  );
}

const NORM_TYPES = ['ГОСТ Р', 'ГОСТ', 'СП', 'СНиП', 'ФЗ'];

/** Разбор «СП 47.13330.2016» → { type: 'СП', code: '47.13330.2016' }. */
export function splitNorm(full: string): { type: string; code: string } {
  const type = NORM_TYPES.find((t) => full.startsWith(`${t} `));
  return type ? { type, code: full.slice(type.length + 1) } : { type: '', code: full };
}

/** components/norm-link.md — штамп: ячейка типа | ячейка номера. */
export function NormLink({ code, clause, href, small }: { code: string; clause?: string; href?: string; small?: boolean }) {
  const n = splitNorm(code);
  const cellText = small ? 'text-11' : 'text-norm-stamp';
  const body = (
    <>
      {n.type ? <span className={cn('border-r border-norm-stamp-border p-norm-stamp-type', cellText)}>{n.type}</span> : null}
      <span className={cn('p-norm-stamp-code', cellText)}>
        {n.code}
        {clause ? `, п. ${clause}` : null}
      </span>
    </>
  );
  const cls = 'inline-flex items-stretch rounded-norm-stamp border border-norm-stamp-border leading-tight whitespace-nowrap text-text-default nums no-underline';
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(cls, 'hover:border-border-accent')}>
      {body}
    </a>
  ) : (
    <span className={cls}>{body}</span>
  );
}

/** components/norm-quote.md — штамп + цитата курсивом в рамке. */
export function NormQuote({ code, children }: { code: string; children: ReactNode }) {
  return (
    <figure className="m-0 flex flex-col items-start gap-3 border border-border-strong p-4">
      <NormLink code={code} />
      <blockquote className="m-0 type-body text-text-default italic">{children}</blockquote>
    </figure>
  );
}

/** components/empty-state.md */
export function EmptyState({ text, action }: { text: ReactNode; action?: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-start gap-3 border-t border-border-default py-6">
      <p className="m-0 type-body text-text-secondary">{text}</p>
      {action}
    </div>
  );
}

/** components/skeleton.md — без мерцания. */
export function Skeleton({ variant = 'card' }: { variant?: 'card' | 'row' }) {
  return variant === 'row' ? (
    <div aria-hidden="true" className="flex gap-4 border-b border-table-rule py-2">
      <span className="h-4 flex-1 rounded-sm bg-skeleton" />
      <span className="h-4 w-1/4 rounded-sm bg-skeleton" />
    </div>
  ) : (
    <div aria-hidden="true" className="flex flex-col gap-3 rounded-card border border-card-border p-card-padding">
      <span className="h-6 w-2/3 rounded-sm bg-skeleton" />
      <span className="h-4 w-full rounded-sm bg-skeleton" />
      <span className="h-4 w-1/2 rounded-sm bg-skeleton" />
    </div>
  );
}

/** components/rating.md — рейтинг на картах со ссылкой на карточку организации. */
export function Rating({ value, source, count, href }: { value: string; source: string; count: string; href?: string }) {
  const body = (
    <>
      <span className="nums">{value}</span> · {count}
    </>
  );
  return (
    <span className="flex flex-col gap-1">
      <span className="type-kicker text-text-muted">{source}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-15 text-text-default underline decoration-border-default underline-offset-4">
          {body}
        </a>
      ) : (
        <span className="text-15">{body}</span>
      )}
    </span>
  );
}

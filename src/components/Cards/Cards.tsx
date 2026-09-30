import { ArrowRight, Download, FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Plate, type PlateRatio } from '../Plate/Plate';

// components/cards.md — общая анатомия .card. Вся карточка кликабельна: ссылка в заголовке
// растянута псевдоэлементом. Hover — рамка gold; при фильтре — dimmed 0.5.
const boxClasses =
  'relative flex flex-col gap-2 rounded-card border border-card-border p-card-padding transition-colors hover:border-card-border-hover has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring';
const bareClasses = 'group relative flex flex-col gap-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring';
const stretchedClasses = 'text-text-default no-underline outline-none after:absolute after:inset-0';

function Title({ href, onClick, children, className }: { href?: string; onClick?: () => void; children: ReactNode; className?: string }) {
  const cls = cn('m-0 type-title-card', className);
  if (onClick)
    return (
      <h3 className={cls}>
        <button type="button" onClick={onClick} className={cn(stretchedClasses, 'cursor-pointer border-0 bg-transparent p-0 text-left font-heading text-20 font-semibold')}>
          {children}
        </button>
      </h3>
    );
  return <h3 className={cls}>{href ? <a href={href} className={stretchedClasses}>{children}</a> : children}</h3>;
}

const Kicker = ({ children }: { children: ReactNode }) => <p className="m-0 type-kicker text-text-accent">{children}</p>;
const Meta = ({ left, right }: { left?: ReactNode; right?: ReactNode }) => (
  <div className="mt-auto flex items-baseline justify-between gap-3 border-t border-border-default pt-3 type-small nums">
    <span className="text-text-default">{left}</span>
    <span className="text-text-muted">{right}</span>
  </div>
);

export function DirectionCard({ href, title, text, from, days, dimmed }: { href: string; title: string; text: string; from?: string; days?: string; dimmed?: boolean }) {
  return (
    <article className={cn(boxClasses, 'min-h-72', dimmed && 'opacity-dimmed')}>
      <Title href={href}>{title}</Title>
      <p className="m-0 type-small text-text-secondary">{text}</p>
      <Meta left={from} right={days} />
    </article>
  );
}

export function ServiceCard({ href, title, text, from }: { href: string; title: string; text?: string; from?: string }) {
  return (
    <article className={boxClasses}>
      <Title href={href}>{title}</Title>
      {text ? <p className="m-0 type-small text-text-secondary">{text}</p> : null}
      <div className="mt-auto flex items-center justify-between gap-3 pt-2 type-small nums">
        <span>{from}</span>
        <ArrowRight className="size-16 text-accent-default" strokeWidth={1.5} aria-hidden="true" />
      </div>
    </article>
  );
}

/** Сценарий — строка оглавления на первом экране главной. */
export function ScenarioRow({ n, href, title, text, price }: { n: number; href: string; title: string; text: string; price: string }) {
  return (
    <li className="relative flex items-center gap-4 border-b border-border-default py-3 has-focus-visible:outline-2 has-focus-visible:outline-focus-ring">
      <span className="w-6 shrink-0 font-heading text-20 text-text-accent nums">{String(n).padStart(2, '0')}</span>
      <span className="flex flex-1 flex-col gap-1">
        <a href={href} className={cn(stretchedClasses, 'font-heading text-22 leading-heading')}>
          {title}
        </a>
        <span className="type-small text-text-muted">{text}</span>
      </span>
      <span className="shrink-0 type-small text-text-default nums">{price}</span>
      <ArrowRight className="size-icon shrink-0 text-accent-default" strokeWidth={1.5} aria-hidden="true" />
    </li>
  );
}

export function SampleCard({ type, title, meta, onOpen, href, dimmed, ratio = '3/4' }: { type: string; title: string; meta?: string; onOpen?: () => void; href?: string; dimmed?: boolean; ratio?: PlateRatio }) {
  return (
    <article className={cn(bareClasses, dimmed && 'opacity-dimmed')}>
      <Plate label={`скан: ${type.toLowerCase()}`} ratio={ratio} className="group-hover:border-card-border-hover" />
      <Kicker>{type}</Kicker>
      <Title href={href} onClick={onOpen} className="text-18">
        {title}
      </Title>
      {meta ? <p className="m-0 type-small text-text-muted nums">{meta}</p> : null}
    </article>
  );
}

export function CaseCard({ href, kicker, title, text, figure, dimmed }: { href?: string; kicker: string; title: string; text?: string; figure: string; dimmed?: boolean }) {
  return (
    <article className={cn(boxClasses, dimmed && 'opacity-dimmed')}>
      <Kicker>{kicker}</Kicker>
      <Title href={href}>{title}</Title>
      {text ? <p className="m-0 type-small text-text-secondary">{text}</p> : null}
      <p className="mt-auto mb-0 border-t border-border-default pt-3 font-heading text-24 leading-heading nums">{figure}</p>
    </article>
  );
}

export function PersonCard({ name, role, note, large }: { name: string; role: string; note?: string; large?: boolean }) {
  return (
    <article className={cn('flex flex-col gap-2', large && 'md:flex-row md:gap-6')}>
      <Plate label="фото сотрудника" ratio="4/5" className={large ? 'md:w-1/3' : undefined} />
      <div className="flex flex-col gap-1">
        <h3 className="m-0 type-title-card">{name}</h3>
        <p className="m-0 type-small text-text-secondary">{role}</p>
        {note ? <p className="m-0 type-small text-text-muted">{note}</p> : null}
      </div>
    </article>
  );
}

export function EquipmentCard({ title, specs, dimmed }: { title: string; specs: string[]; dimmed?: boolean }) {
  return (
    <article className={cn('flex flex-col gap-2', dimmed && 'opacity-dimmed')}>
      <Plate label="фото техники" ratio="4/3" />
      <h3 className="m-0 type-title-card">{title}</h3>
      <ul className="m-0 flex list-none flex-col gap-1 p-0 type-small text-text-secondary">
        {specs.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </article>
  );
}

export function DocumentCard({ title, meta, href }: { title: string; meta: string; href?: string }) {
  return (
    <article className={cn(boxClasses, 'flex-row items-start gap-3')}>
      <FileText className="size-icon-lg shrink-0 text-accent-default" strokeWidth={1.5} aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="m-0 font-heading text-18 leading-heading font-semibold">
          {href ? (
            <a href={href} download className={stretchedClasses}>
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="m-0 type-small text-text-muted nums">{meta}</p>
      </div>
      <Download className="size-icon shrink-0 text-accent-default" strokeWidth={1.5} aria-hidden="true" />
    </article>
  );
}

export function ArticleCard({ href, kicker, title, minutes, dimmed }: { href: string; kicker: string; title: string; minutes: number; dimmed?: boolean }) {
  return (
    <article className={cn(bareClasses, dimmed && 'opacity-dimmed')}>
      <Plate label="обложка статьи" ratio="16/9" className="group-hover:border-card-border-hover" />
      <Kicker>{kicker}</Kicker>
      <Title href={href}>{title}</Title>
      <p className="m-0 type-small text-text-muted nums">{minutes} мин чтения</p>
    </article>
  );
}

export function LogoCard({ name }: { name: string }) {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-card border border-card-border p-card-padding text-center type-kicker text-text-muted">
      Заглушка · логотип {name}
    </div>
  );
}

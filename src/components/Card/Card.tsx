import { ArrowRight } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { PriceTag } from '../PriceTag/PriceTag';

// Вся карточка кликабельна: ссылка в заголовке растянута псевдоэлементом на карточку.
const cardClasses =
  'relative flex flex-col gap-3 border border-card-border bg-card-bg p-4 transition-colors hover:border-card-border-hover has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring';
const stretchedLinkClasses = 'text-text-primary no-underline outline-none after:absolute after:inset-0';

export function ServiceCard({ href, icon, title, summary, priceFrom }: { href: string; icon: ReactNode; title: string; summary: string; priceFrom?: number }) {
  return (
    <article className={cardClasses}>
      <span className="flex text-text-accent">{icon}</span>
      <h3 className="m-0 text-xl leading-snug font-semibold">
        <a href={href} className={stretchedLinkClasses}>
          {title}
        </a>
      </h3>
      <p className="m-0 text-md leading-normal text-text-secondary">{summary}</p>
      <div className="mt-auto flex items-end justify-between gap-3">
        {priceFrom !== undefined ? <PriceTag kind="from" value={priceFrom} /> : <span />}
        <ArrowRight className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      </div>
    </article>
  );
}

export type SampleType = 'section' | 'column' | 'protocol' | 'conclusion';
const sampleTypeLabel: Record<SampleType, string> = {
  section: 'Разрез',
  column: 'Колонка скважины',
  protocol: 'Протокол',
  conclusion: 'Заключение',
};

export function SampleCard({ href, type, title, meta, preview }: { href: string; type: SampleType; title: string; meta: string; preview?: ReactNode }) {
  return (
    <article className={cardClasses}>
      <div className="aspect-3/4 overflow-hidden border border-border-subtle bg-bg-subtle">{preview ?? <HatchPlaceholder />}</div>
      <span className="self-start border border-border-strong px-2 py-1 font-code text-xs tracking-wide uppercase">{sampleTypeLabel[type]}</span>
      <h3 className="m-0 text-lg leading-snug font-semibold">
        <a href={href} className={stretchedLinkClasses}>
          {title}
        </a>
      </h3>
      <p className="m-0 text-sm text-text-secondary">{meta}</p>
    </article>
  );
}

export function CaseCard({ href, title, place, figures }: { href: string; title: string; place: string; figures: Array<{ value: string; label: string }> }) {
  return (
    <article className={cardClasses}>
      <p className="m-0 font-code text-xs tracking-wide text-text-secondary uppercase">{place}</p>
      <h3 className="m-0 text-xl leading-snug font-semibold">
        <a href={href} className={stretchedLinkClasses}>
          {title}
        </a>
      </h3>
      <dl className="m-0 grid grid-cols-2 gap-3 border-t border-border-default pt-3">
        {figures.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <dt className="order-2 text-sm text-text-secondary">{f.label}</dt>
            <dd className="order-1 m-0 font-code text-xl tabular-nums">{f.value}</dd>
          </div>
        ))}
      </dl>
      <span className="flex items-center gap-2 text-md font-semibold text-text-accent">
        Подробнее <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
    </article>
  );
}

/** Явная заглушка вместо фото/скана: штриховка грунта + подпись. */
export function HatchPlaceholder({ label = 'Превью появится' }: { label?: string }) {
  const id = useId();
  return (
    <div className="relative flex size-full items-center justify-center text-border-control">
      <svg className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <span className="relative bg-bg-surface px-2 py-1 font-code text-xs text-text-secondary">{label}</span>
    </div>
  );
}

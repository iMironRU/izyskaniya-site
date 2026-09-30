import type { NavDirection } from '@/site/nav';
import { ArrowLink } from '../Primitives/Primitives';

/** components/services-panel.md — выпадающая панель направлений (не мега-меню), только desktop. */
export function ServicesPanel({ directions, allHref, onPick }: { directions: NavDirection[]; allHref: string; onPick?: () => void }) {
  return (
    <div className="border-b border-border-default bg-bg-default shadow-md">
      <div className="mx-auto flex max-w-page flex-col gap-6 page-x py-6">
        <div className="grid-auto-panel grid gap-x-6 gap-y-6">
          {directions.map((d) => (
            <div key={d.id} className="flex flex-col gap-2">
              <a href={d.href} onClick={onPick} className="font-heading text-20 leading-heading font-semibold text-text-default no-underline hover:text-text-accent-strong">
                {d.title}
              </a>
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {d.services.slice(0, 3).map((s) => (
                  <li key={s.label}>
                    <a href={s.href} onClick={onPick} className="type-small text-text-secondary no-underline hover:text-text-accent-strong">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              {d.from ? <span className="type-small text-text-muted nums">{d.from}</span> : null}
            </div>
          ))}
        </div>
        <ArrowLink href={allHref}>Все услуги</ArrowLink>
      </div>
    </div>
  );
}

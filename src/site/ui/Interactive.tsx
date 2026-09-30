'use client';

// Клиентские части блочных страниц: формы, карточки с фильтром и просмотрщиком, FAQ, карта, копирование.
import { useMemo, useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { CallbackForm } from '@/components/CallbackForm/CallbackForm';
import { ContactSheet } from '@/components/ContactSheet/ContactSheet';
import { FilterChips } from '@/components/SectionChips/SectionChips';
import { SampleViewer, type Sample } from '@/components/SampleViewer/SampleViewer';
import { Plate, type PlateRatio } from '@/components/Plate/Plate';
import { ObjectsMap, type MapObject } from '@/components/ObjectsMap/ObjectsMap';
import { cn } from '@/lib/cn';
import { demoSender } from '@/lead/demo';
import type { SiteContacts } from '@/site/nav';

export interface FormProps {
  kind: 'callback' | 'tz';
  contacts: SiteContacts;
  privacyHref: string;
  thanksHref: string;
  title?: string;
  lead?: string;
}

/** Встроенная форма (Контакты, «Не нашли ответ?»). Отправитель — заглушка до этапа 7. */
export function InlineForm(props: FormProps) {
  return <CallbackForm kind={props.kind} title={props.title} lead={props.lead} sender={demoSender} privacyHref={props.privacyHref} thanksHref={props.thanksHref} phone={props.contacts.phone} />;
}

/** Кнопка, открывающая контакт-лист с формой — только по действию пользователя, не попап. */
export function FormButton({ label, variant = 'secondary', ...form }: FormProps & { label: string; variant?: 'primary' | 'secondary' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open ? (
        <ContactSheet title={form.kind === 'tz' ? 'Отправить ТЗ' : 'Связаться'} contacts={form.contacts} onClose={() => setOpen(false)}>
          <InlineForm {...form} />
        </ContactSheet>
      ) : null}
    </>
  );
}

export interface GridCard {
  tag?: string;
  kicker?: string;
  title: string;
  text?: string;
  meta?: string;
  href?: string;
  ph?: string;
  facts?: string[];
}

const ratioFor = (ph?: string): PlateRatio => (!ph ? '4/3' : /скан|страниц/.test(ph) ? '3/4' : /обложк/.test(ph) ? '16/9' : /фото (сотрудника|человека)/.test(ph) ? '4/5' : '4/3');

/** Сетка карточек (cards.md) с фильтром-чипами и просмотрщиком образцов. */
export function CardsGrid({ items, filter, viewer, callouts, grid = 'grid-auto-card', name }: { items: GridCard[]; filter?: string[]; viewer?: boolean; callouts?: Array<{ t: string; d: string }>; grid?: string; name: string }) {
  const [tag, setTag] = useState(filter?.[0] ?? 'Все');
  const [open, setOpen] = useState<number | null>(null);
  const all = filter?.[0] ?? 'Все';
  const ordered = useMemo(() => {
    if (tag === all) return items.map((it) => ({ it, match: true }));
    const m = items.filter((i) => i.tag === tag).map((it) => ({ it, match: true }));
    const rest = items.filter((i) => i.tag !== tag).map((it) => ({ it, match: false }));
    return [...m, ...rest];
  }, [items, tag, all]);
  const samples: Sample[] = items.map((it, i) => ({
    id: String(i),
    type: it.kicker ?? it.tag ?? 'Образец',
    title: it.title,
    meta: [it.text, it.meta].filter(Boolean).join(' · '),
    callouts: callouts?.map((c, n) => ({ n: n + 1, text: `${c.t}. ${c.d}`, col: 3 + n * 3, row: 3 + n * 4 })),
  }));

  return (
    <div className="flex flex-col gap-4">
      {filter?.length ? <FilterChips name={`${name}-filter`} label="Фильтр" value={tag} onChange={setTag} options={filter.map((f) => ({ value: f, label: f }))} /> : null}
      <div className={cn(grid, 'grid gap-x-4 gap-y-6')}>
        {ordered.map(({ it, match }) => {
          const idx = items.indexOf(it);
          const inner = (
            <>
              {it.ph ? <Plate label={it.ph} ratio={ratioFor(it.ph)} className="group-hover:border-card-border-hover" /> : null}
              {it.kicker ? <p className="m-0 type-kicker text-text-accent">{it.kicker}</p> : null}
              <h3 className="m-0 type-title-card">
                {viewer ? (
                  <button type="button" onClick={() => setOpen(idx)} className="cursor-pointer border-0 bg-transparent p-0 text-left font-heading text-20 font-semibold text-text-default after:absolute after:inset-0">
                    {it.title}
                  </button>
                ) : it.href ? (
                  <a href={it.href} className="text-text-default no-underline after:absolute after:inset-0">
                    {it.title}
                  </a>
                ) : (
                  it.title
                )}
              </h3>
              {it.text ? <p className="m-0 type-small text-text-secondary">{it.text}</p> : null}
              {it.facts?.length ? (
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {it.facts.map((f) => (
                    <li key={f} className="rounded-sm bg-tag-neutral-bg p-tag text-tag text-tag-neutral-text">
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}
              {it.meta ? <p className="mt-auto mb-0 border-t border-border-default pt-2 type-small text-text-muted nums">{it.meta}</p> : null}
            </>
          );
          return (
            <article
              key={`${it.title}-${idx}`}
              className={cn(
                'group relative flex flex-col gap-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring',
                !it.ph && 'rounded-card border border-card-border p-card-padding hover:border-card-border-hover',
                !match && 'opacity-dimmed',
              )}
            >
              {inner}
            </article>
          );
        })}
      </div>
      {viewer && open !== null ? <SampleViewer items={samples} index={open} onIndex={setOpen} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

/** Карта объектов из блока map: координаты прототипа x/y (0–100) → условные lat/lng заглушки. */
export function ObjectsMapBlock({ items, filter, mapOnly }: { mapOnly?: boolean; items: Array<{ tag: string; kicker: string; t: string; d?: string; fig?: string; href?: string; x: number; y: number }>; filter?: string[] }) {
  const objects: MapObject[] = items.map((o, i) => ({
    id: String(i),
    title: o.t,
    kind: o.tag,
    place: o.kicker.split('·').slice(1).join('·').trim() || o.kicker,
    lat: 100 - o.y,
    lng: o.x,
    figure: o.fig,
    text: o.d,
    href: o.href,
  }));
  return <ObjectsMap items={objects} kinds={filter?.filter((f) => f !== 'Все')} mapOnly={mapOnly} />;
}

/** Ссылка-строка со стрелкой (финальные CTA внутри страниц). */
export function RowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="flex items-center justify-between gap-3 border-b border-border-default py-3 text-text-default no-underline hover:text-text-accent-strong">
      {children}
      <ArrowRight className="size-icon text-accent-default" strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { CaseCard } from '../Cards/Cards';
import { FilterChips } from '../SectionChips/SectionChips';
import { Segmented } from '../Segmented/Segmented';

export interface MapObject {
  id: string;
  title: string;
  kind: string;
  place: string;
  lat: number;
  lng: number;
  /** Сколько объектов в точке (кластер) */
  count?: number;
  figure?: string;
  text?: string;
  href?: string;
}

/**
 * components/map.md — карта объектов (заглушка сеткой, как в прототипе): фильтры, точки,
 * карточка выбранной точки, список. Desktop: карта + список; mobile: «Список / Карта», по умолчанию список.
 * Кластеризация и подложка — в реальной карте (этап 7).
 */
export function ObjectsMap({ items, kinds, compact, mapOnly }: { items: MapObject[]; kinds?: string[]; compact?: boolean; mapOnly?: boolean }) {
  const [kind, setKind] = useState('all');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selected, setSelected] = useState<string | null>(items[0]?.id ?? null);

  const shown = useMemo(() => items.filter((i) => kind === 'all' || i.kind === kind), [items, kind]);
  const box = useMemo(() => {
    const lats = items.map((i) => i.lat);
    const lngs = items.map((i) => i.lng);
    return { minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs) };
  }, [items]);
  // Точки ставим в ячейки сетки 24×18 (классы col-start-N/row-start-N объявлены в globals.css):
  // инлайн-стили запрещены гейтом, а сетка даёт достаточную точность для заглушки.
  const cell = (o: MapObject) => ({
    col: 2 + Math.round(((o.lng - box.minLng) / (box.maxLng - box.minLng || 1)) * 20),
    row: 2 + Math.round(((box.maxLat - o.lat) / (box.maxLat - box.minLat || 1)) * 14),
  });
  const current = shown.find((i) => i.id === selected) ?? shown[0];

  const map = (
    <div className="relative aspect-4/3 overflow-hidden rounded-md border border-border-default">
      <svg className="absolute inset-0 size-full text-border-default" aria-hidden="true">
        <defs>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
      </svg>
      <span className="absolute top-3 left-3 bg-bg-default px-2 type-small text-text-muted">Карта — заглушка</span>
      <div className="absolute inset-0 grid grid-cols-24 grid-rows-18">
      {shown.map((o) => {
        const p = cell(o);
        const on = current?.id === o.id;
        const big = (o.count ?? 1) > 20;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => setSelected(o.id)}
            aria-pressed={on}
            aria-label={`${o.title}, ${o.place}${o.count ? `, ${o.count} объектов` : ''}`}
            className={cn(
              `col-start-${p.col} row-start-${p.row}`,
              'z-10 flex cursor-pointer items-center justify-center place-self-center rounded-full border border-accent-default font-body text-11 nums',
              big ? 'size-8' : on ? 'size-map-point' : 'size-20',
              on ? 'bg-accent-default text-bg-default' : 'bg-bg-default text-text-default',
            )}
          >
            {o.count ?? ''}
          </button>
        );
      })}
      </div>
    </div>
  );

  const list = (
    <ul className="m-0 flex list-none flex-col border-t border-border-strong p-0">
      {shown.map((o) => (
        <li key={o.id} className="border-b border-border-default">
          <button type="button" onClick={() => setSelected(o.id)} aria-pressed={current?.id === o.id} className={cn('flex w-full cursor-pointer flex-col gap-1 border-0 bg-transparent py-3 text-left', current?.id === o.id && 'text-text-accent-strong')}>
            <span className="type-kicker text-text-accent">
              {o.kind} · {o.place}
            </span>
            <span className="font-heading text-20 leading-heading font-semibold">{o.title}</span>
            {o.figure ? <span className="type-small text-text-muted">{o.figure}</span> : null}
          </button>
        </li>
      ))}
    </ul>
  );

  if (mapOnly) return map;

  return (
    <div className="flex flex-col gap-4">
      {kinds?.length ? <FilterChips name="map-kind" label="Тип объекта" value={kind} onChange={setKind} options={[{ value: 'all', label: 'Все' }, ...kinds.map((k) => ({ value: k, label: k }))]} /> : null}
      <div className="md:hidden">
        <Segmented name="map-view" label="Вид" block value={view} onChange={setView} options={[{ value: 'list', label: 'Список' }, { value: 'map', label: 'Карта' }]} />
      </div>
      <div className={cn('grid gap-6', !compact && 'md:grid-cols-2')}>
        <div className={cn(view === 'list' && 'hidden md:block')}>{map}</div>
        <div className={cn('flex flex-col gap-4', view === 'map' && 'hidden md:flex')}>
          {current ? <CaseCard kicker={`${current.kind} · ${current.place}`} title={current.title} text={current.text} figure={current.figure ?? ''} href={current.href} /> : null}
          {compact ? null : list}
        </div>
      </div>
    </div>
  );
}

'use client';

import { ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '../Button/Button';
import { Plate } from '../Plate/Plate';

export interface Callout {
  n: number;
  text: string;
  /** Положение выноски на полотне, % (ячейка сетки 12×16) */
  col: number;
  row: number;
}

export interface Sample {
  id: string;
  type: string;
  title: string;
  meta?: string;
  callouts?: Callout[];
}

const ZOOMS = [100, 150, 200, 300] as const;
const zoomClasses: Record<(typeof ZOOMS)[number], string> = { 100: 'w-full', 150: 'w-3/2', 200: 'w-2/1', 300: 'w-3/1' };

/**
 * components/sample-viewer.md — шапка (тип, название, N из M, зум, закрыть), полотно с зумом,
 * выноски-номера, панель «Как читать» (desktop справа 340px, mobile — нижняя шторка 38vh), Назад/Далее.
 * Esc закрывает, ← → листают.
 */
export function SampleViewer({ items, index, onIndex, onClose }: { items: Sample[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(100);
  const box = useRef<HTMLDivElement>(null);
  const it = items[index];
  const go = (d: number) => {
    onIndex((index + d + items.length) % items.length);
    setZoom(100);
  };

  useEffect(() => {
    box.current?.querySelector<HTMLElement>('button')?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const zi = ZOOMS.indexOf(zoom);

  return (
    <div ref={box} role="dialog" aria-modal="true" aria-label={`${it.type}: ${it.title}`} className="fixed inset-0 z-40 flex flex-col bg-bg-default">
      <div className="flex min-h-header-height-mobile shrink-0 flex-wrap items-center gap-3 border-b border-border-default page-x py-2">
        <div className="flex flex-1 flex-col">
          <span className="type-kicker text-text-accent">{it.type}</span>
          <span className="font-heading text-20 leading-heading font-semibold">{it.title}</span>
        </div>
        <span className="type-small text-text-muted nums">
          {index + 1} из {items.length}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="secondary" icon aria-label="Уменьшить" disabled={zi === 0} onClick={() => setZoom(ZOOMS[zi - 1])}>
            <Minus className="size-icon" strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <span className="w-48 text-center type-small nums" aria-live="polite">
            {zoom}%
          </span>
          <Button variant="secondary" icon aria-label="Увеличить" disabled={zi === ZOOMS.length - 1} onClick={() => setZoom(ZOOMS[zi + 1])}>
            <Plus className="size-icon" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
        <Button variant="secondary" icon aria-label="Закрыть просмотр" onClick={onClose}>
          <X className="size-icon" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="min-h-0 flex-1 overflow-auto bg-bg-surface p-6">
          <div className={cn('relative mx-auto max-w-measure', zoomClasses[zoom])}>
            <Plate label={`скан: ${it.type.toLowerCase()}`} ratio="3/4" />
            <div className="pointer-events-none absolute inset-0 grid grid-cols-12 grid-rows-16">
              {(it.callouts ?? []).map((c) => (
                <span
                  key={c.n}
                  className={cn(`col-start-${c.col} row-start-${c.row}`, 'flex size-8 items-center justify-center place-self-center rounded-full border border-accent-default bg-bg-default font-heading text-18 text-text-accent nums')}
                >
                  {c.n}
                </span>
              ))}
            </div>
          </div>
        </div>
        <aside aria-label="Как читать" className="h-viewer-sheet shrink-0 overflow-y-auto border-t border-border-default p-4 md:h-auto md:w-viewer-panel md:border-t-0 md:border-l">
          <h2 className="m-0 mb-3 type-h3">Как читать</h2>
          {it.callouts?.length ? (
            <ol className="m-0 flex list-none flex-col gap-3 p-0">
              {it.callouts.map((c) => (
                <li key={c.n} className="flex gap-3 type-body">
                  <span className="font-heading text-20 text-text-accent nums">{c.n}</span>
                  <span>{c.text}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="m-0 type-body text-text-secondary">{it.meta}</p>
          )}
        </aside>
      </div>

      <div className="flex shrink-0 justify-between gap-3 border-t border-border-default page-x py-3">
        <Button variant="secondary" onClick={() => go(-1)} iconStart={<ChevronLeft className="size-icon" strokeWidth={1.5} aria-hidden="true" />}>
          Назад
        </Button>
        <Button variant="secondary" onClick={() => go(1)} iconEnd={<ChevronRight className="size-icon" strokeWidth={1.5} aria-hidden="true" />}>
          Далее
        </Button>
      </div>
    </div>
  );
}

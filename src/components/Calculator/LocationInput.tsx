'use client';

import { colorAccentDefault, colorTextDefault } from '@tokens';
import type { CircleMarker, Map as LeafletMap } from 'leaflet';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NumberField } from '@/components/Input/Input';
import { Segmented } from '@/components/Segmented/Segmented';
import { travelZone } from '@/engine/calculate';
import { UNKNOWN, type Pricing, type Question } from '@/engine/schema';
import { formatNumber } from '@/lib/format';
import { distanceKm, type LatLng } from '@/lib/geo';
import type { Draft } from './quiz';

export interface LocationValue {
  office: LatLng;
  zoom: number;
  pricing: Pricing;
  point: LatLng | null;
  onPoint: (p: LatLng | null) => void;
}

type Mode = 'map' | 'km' | 'skip';

/** Шаг «Участок» (calc-step.md, вариант location): точка на карте / расстояние / пропустить + кадастровый номер. */
export function LocationInput({ question: q, draft, onDraft, error, office, zoom, pricing, point, onPoint, children }: LocationValue & { question: Question; draft: Draft; onDraft: (d: Draft) => void; error?: string; children?: ReactNode }) {
  const isUnknown = draft === UNKNOWN;
  const [mode, setMode] = useState<Mode>(isUnknown ? 'skip' : point || draft === null ? 'map' : 'km');
  const km = typeof draft === 'string' && !isUnknown ? Number(draft.replace(',', '.')) : null;
  const zone = km !== null && Number.isFinite(km) ? travelZone(pricing, km) : null;

  const switchMode = (m: Mode) => {
    setMode(m);
    if (m === 'skip') {
      onPoint(null);
      onDraft(UNKNOWN);
    } else if (isUnknown) onDraft(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <Segmented<Mode>
        name={`${q.id}-mode`}
        label="Как указать участок"
        block
        value={mode}
        onChange={switchMode}
        options={[
          { value: 'map', label: 'Точка на карте' },
          { value: 'km', label: 'Расстояние, км' },
          { value: 'skip', label: 'Пропустить' },
        ]}
      />
      {mode === 'map' ? (
        <MapPicker
          office={office}
          zoom={zoom}
          point={point}
          onPick={(p) => {
            onPoint(p);
            onDraft(String(Math.round(distanceKm(office, p))));
          }}
          onFail={() => setMode('km')}
        />
      ) : null}
      {mode === 'km' ? (
        <NumberField
          label="Расстояние от офиса"
          hint="По прямой, примерно"
          unit="км"
          value={km === null ? '' : String(draft)}
          onChange={(e) => {
            onPoint(null);
            onDraft(e.target.value);
          }}
          error={error}
        />
      ) : null}
      {mode === 'skip' && q.unknown ? <p className="m-0 type-body text-text-secondary">{q.unknown.note}</p> : null}
      <p aria-live="polite" className="m-0 min-h-6 type-body nums">
        {mode !== 'skip' && zone && km !== null ? (
          <>
            ≈ {formatNumber(km)} км от офиса · выезд «{zone.title}»{zone.price === null ? ' — по согласованию' : null}
          </>
        ) : null}
      </p>
      {children}
    </div>
  );
}

function MapPicker({ office, zoom, point, onPick, onFail }: { office: LatLng; zoom: number; point: LatLng | null; onPick: (p: LatLng) => void; onFail: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const marker = useRef<CircleMarker | null>(null);
  const pick = useRef(onPick);
  useEffect(() => {
    pick.current = onPick;
  }, [onPick]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')])
      .then(([L]) => {
        if (cancelled || !box.current) return;
        const m = L.map(box.current, { center: point ?? office, zoom });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© участники <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(m);
        L.circleMarker(office, { radius: 6, color: colorTextDefault, fillColor: colorTextDefault, fillOpacity: 1 }).addTo(m).bindTooltip('Наш офис');
        const place = (p: LatLng) => {
          if (marker.current) marker.current.setLatLng(p);
          else marker.current = L.circleMarker(p, { radius: 9, color: colorAccentDefault, weight: 2, fillColor: colorAccentDefault, fillOpacity: 0.25 }).addTo(m);
        };
        if (point) place(point);
        m.on('click', (e) => {
          const p = { lat: e.latlng.lat, lng: e.latlng.lng };
          place(p);
          pick.current(p);
        });
        map.current = m;
      })
      .catch(onFail);
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      marker.current = null;
    };
    // Карта создаётся один раз; дальше меняется только маркер.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div ref={box} className="aspect-4/3 w-full rounded-md border border-border-default bg-bg-surface md:aspect-16/9" aria-label="Карта: нажмите на место участка" />
      <p className="m-0 type-small text-text-muted">Нажмите на карте, где находится участок. С клавиатуры — вкладка «Расстояние, км».</p>
    </div>
  );
}

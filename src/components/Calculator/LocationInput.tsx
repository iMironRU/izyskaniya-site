'use client';

import { colorAccentDefault, colorTextPrimary } from '@tokens';
import type { Map as LeafletMap, CircleMarker } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { NumberField } from '@/components/Field/Field';
import { OptionGroup } from '@/components/OptionTile/OptionGroup';
import { UNKNOWN, type Pricing, type Question } from '@/engine/schema';
import { travelZone } from '@/engine/calculate';
import { cn } from '@/lib/cn';
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

interface Props extends LocationValue {
  question: Question;
  draft: Draft;
  onDraft: (d: Draft) => void;
  error?: string;
}

const tabClasses = 'min-h-11 flex-1 cursor-pointer border border-border-strong px-3 text-md font-semibold';

export function LocationInput({ question: q, draft, onDraft, error, office, zoom, pricing, point, onPoint }: Props) {
  const [mode, setMode] = useState<'map' | 'number'>('map');
  const isUnknown = draft === UNKNOWN;
  const km = typeof draft === 'string' && draft !== UNKNOWN ? Number(draft.replace(',', '.')) : null;
  const zone = km !== null && Number.isFinite(km) ? travelZone(pricing, km) : null;

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Как указать место" className="flex">
        {(['map', 'number'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(tabClasses, m === 'number' && 'border-l-0', mode === m ? 'bg-bg-inverse text-text-inverse' : 'bg-bg-surface text-text-primary')}
          >
            {m === 'map' ? 'Точка на карте' : 'Расстояние в км'}
          </button>
        ))}
      </div>

      {mode === 'map' ? (
        <MapPicker
          office={office}
          zoom={zoom}
          point={point}
          onPick={(p) => {
            onPoint(p);
            onDraft(String(Math.round(distanceKm(office, p))));
          }}
          onFail={() => setMode('number')}
        />
      ) : (
        <NumberField
          label={q.title}
          labelHidden
          hint="По прямой от нашего офиса"
          unit="км"
          value={km === null || isUnknown ? '' : String(draft)}
          onChange={(e) => {
            onPoint(null);
            onDraft(e.target.value);
          }}
          error={error}
        />
      )}

      <p aria-live="polite" className="m-0 min-h-6 text-md">
        {zone && km !== null && !isUnknown ? (
          <>
            ≈ <span className="font-semibold tabular-nums">{formatNumber(km)} км</span> от офиса, зона выезда «{zone.title}»
            {zone.price === null ? ' — стоимость выезда согласуем отдельно' : null}
          </>
        ) : null}
      </p>

      {q.unknown ? (
        <OptionGroup
          name={`${q.id}-unknown`}
          legend="Или"
          legendHidden
          options={[{ value: UNKNOWN, label: q.unknown.label, hint: q.unknown.note, unknown: true }]}
          value={isUnknown ? UNKNOWN : null}
          onChange={(v) => {
            onPoint(null);
            onDraft(v);
          }}
        />
      ) : null}
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
        const m = L.map(box.current, { center: point ?? office, zoom, attributionControl: true });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© участники <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(m);
        L.circleMarker(office, { radius: 6, color: colorTextPrimary, fillColor: colorTextPrimary, fillOpacity: 1 }).addTo(m).bindTooltip('Наш офис');
        const place = (p: LatLng) => {
          if (marker.current) marker.current.setLatLng(p);
          else marker.current = L.circleMarker(p, { radius: 9, color: colorAccentDefault, weight: 3, fillOpacity: 0.3 }).addTo(m);
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
    // Карта создаётся один раз; точка и офис дальше меняются через маркер.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div ref={box} className="aspect-4/3 w-full border border-field-border bg-bg-subtle md:aspect-16/9" aria-label="Карта: нажмите на место участка" />
      <p className="m-0 text-sm text-text-secondary">Нажмите на карте, где находится участок. Если карта не открывается — укажите расстояние в км.</p>
    </div>
  );
}

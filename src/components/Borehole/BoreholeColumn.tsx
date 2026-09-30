import { useId } from 'react';
import { formatNumber } from '@/lib/format';

export type SoilPattern = 'soil' | 'loam' | 'sand' | 'clay' | 'gravel' | 'peat';

export interface SoilLayer {
  to: number;
  name: string;
  note?: string;
  pattern: SoilPattern;
}

/**
 * Колонка скважины для первого экрана главной (только desktop): слои с отраслевыми штриховками,
 * шкала глубин, уровень грунтовых вод. Демо-данные — в data/site/home.yaml.
 */
export function BoreholeColumn({ title, elevation, layers, water }: { title: string; elevation?: string; layers: SoilLayer[]; water?: number }) {
  const uid = useId().replace(/:/g, '');
  const depth = layers.at(-1)?.to ?? 10;
  const H = 390;
  const top = 12;
  const y = (m: number) => top + (m / depth) * H;
  const colX = 58;
  const colW = 72;
  const ticks = Array.from({ length: Math.floor(depth / 2) + 1 }, (_, i) => i * 2);

  return (
    <figure className="m-0 flex flex-col gap-2 text-text-default">
      <figcaption className="flex justify-between border-b border-border-strong pb-2 type-kicker text-text-muted">
        <span>{title}</span>
        {elevation ? <span className="nums">{elevation}</span> : null}
      </figcaption>
      <svg viewBox="0 0 440 420" className="h-auto w-full" role="img" aria-label={`${title}: ${layers.map((l) => `${l.name} до ${formatNumber(l.to)} м`).join(', ')}`}>
        <defs>
          <pattern id={`${uid}-soil`} width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 6L6 0M0 0L6 6" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
          <pattern id={`${uid}-loam`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 8L8 0" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
          <pattern id={`${uid}-sand`} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="currentColor" />
            <circle cx="5.5" cy="5.5" r="0.8" fill="currentColor" />
          </pattern>
          <pattern id={`${uid}-clay`} width="10" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 3H10" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
          <pattern id={`${uid}-gravel`} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="2.2" fill="none" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
          <pattern id={`${uid}-peat`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 4H4M4 0V4" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={colX - 6} x2={colX} y1={y(t)} y2={y(t)} stroke="currentColor" strokeWidth="1" />
            <text x={colX - 12} y={y(t) + 4} textAnchor="end" className="fill-text-muted font-body text-11">
              {t === depth ? `${t} м` : t}
            </text>
          </g>
        ))}
        <line x1={colX - 6} x2={colX - 6} y1={y(0)} y2={y(depth)} stroke="currentColor" strokeWidth="1" />

        {layers.map((l, i) => {
          const from = i === 0 ? 0 : layers[i - 1].to;
          const mid = (y(from) + y(l.to)) / 2;
          return (
            <g key={l.name}>
              <rect x={colX} y={y(from)} width={colW} height={y(l.to) - y(from)} fill={`url(#${uid}-${l.pattern})`} stroke="currentColor" strokeWidth="1" />
              <line x1={colX + colW} x2={200} y1={mid} y2={mid} className="stroke-border-default" strokeWidth="1" />
              <text x={206} y={mid - 2} className="fill-text-default font-body text-13">
                {l.name}
              </text>
              {l.note ? (
                <text x={206} y={mid + 13} className="fill-text-muted font-body text-11">
                  {l.note} · до {formatNumber(l.to)} м
                </text>
              ) : null}
            </g>
          );
        })}

        {water !== undefined ? (
          <g className="text-accent-default">
            <line x1={colX - 14} x2={colX + colW + 24} y1={y(water)} y2={y(water)} stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
            <text x={colX + colW + 30} y={y(water) + 4} className="fill-text-accent font-body text-11">
              УГВ {formatNumber(water)} м
            </text>
          </g>
        ) : null}
      </svg>
    </figure>
  );
}

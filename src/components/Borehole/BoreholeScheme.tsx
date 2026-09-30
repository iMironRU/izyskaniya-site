import { formatNumber } from '@/lib/format';

/** Точки скважин в долях пятна: по углам, при нечётном числе — ещё в центре. */
export function boreholePoints(count: number): Array<[number, number]> {
  const corners: Array<[number, number]> = [
    [0.12, 0.15],
    [0.88, 0.85],
    [0.88, 0.15],
    [0.12, 0.85],
  ];
  if (count <= 1) return [[0.5, 0.5]];
  if (count === 2) return corners.slice(0, 2);
  if (count === 3) return [corners[0], corners[1], [0.5, 0.5]];
  if (count === 4) return corners;
  const extra = count - 4;
  const mids: Array<[number, number]> = Array.from({ length: extra }, (_, i) => [(i + 1) / (extra + 1), 0.5]);
  return [...corners, ...mids];
}

/**
 * components/borehole-scheme.md — схема скважин на пятне застройки: контур, размерные линии,
 * точки (кольцо gold + центр), подписи. Масштаб по большей стороне, подпись «без масштаба».
 */
export function BoreholeScheme({ length, width, count }: { length: number; width: number; count: number }) {
  const W = 320;
  const Hmax = 200;
  const long = Math.max(length, width);
  const k = W / long;
  const w = Math.max(length * k, 60);
  const h = Math.min(Math.max(width * k, 60), Hmax);
  const ox = 40 + (W - w) / 2;
  const oy = 20;
  const pts = boreholePoints(count);

  return (
    <figure className="m-0 flex flex-col gap-2">
      <svg viewBox={`0 0 400 ${h + 70}`} className="h-auto w-full text-text-default" role="img" aria-label={`Схема: ${count} скважин на пятне ${formatNumber(length)} × ${formatNumber(width)} м`}>
        <rect x={ox} y={oy} width={w} height={h} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 3" />
        <line x1={ox} x2={ox + w} y1={oy + h + 22} y2={oy + h + 22} stroke="currentColor" strokeWidth="1" />
        <line x1={ox} x2={ox} y1={oy + h + 16} y2={oy + h + 28} stroke="currentColor" strokeWidth="1" />
        <line x1={ox + w} x2={ox + w} y1={oy + h + 16} y2={oy + h + 28} stroke="currentColor" strokeWidth="1" />
        <text x={ox + w / 2} y={oy + h + 40} textAnchor="middle" className="fill-text-muted font-body text-11">
          {formatNumber(length)} м
        </text>
        <line x1={ox - 22} x2={ox - 22} y1={oy} y2={oy + h} stroke="currentColor" strokeWidth="1" />
        <line x1={ox - 28} x2={ox - 16} y1={oy} y2={oy} stroke="currentColor" strokeWidth="1" />
        <line x1={ox - 28} x2={ox - 16} y1={oy + h} y2={oy + h} stroke="currentColor" strokeWidth="1" />
        <text x={ox - 28} y={oy + h / 2} textAnchor="end" dominantBaseline="middle" className="fill-text-muted font-body text-11">
          {formatNumber(width)} м
        </text>
        {pts.map(([px, py], i) => {
          const cx = ox + px * w;
          const cy = oy + py * h;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="8" fill="none" className="stroke-accent-default" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="2.5" className="fill-accent-default" />
              <text x={cx + 12} y={cy - 8} className="fill-text-default font-body text-11">
                С-{i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="type-small text-text-muted">
        {count} {count === 1 ? 'скважина' : count < 5 ? 'скважины' : 'скважин'} на пятне {formatNumber(length)} × {formatNumber(width)} м · без масштаба
      </figcaption>
    </figure>
  );
}

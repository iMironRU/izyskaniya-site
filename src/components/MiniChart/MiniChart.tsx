import { formatNumber } from '@/lib/format';

export interface ChartYear {
  year: string;
  value: number;
}

/** components/mini-chart.md — метры бурения по годам: столбцы с контуром gold и заливкой 14%. */
export function MiniChart({ years, title = 'Метры бурения по годам', unit = 'м' }: { years: ChartYear[]; title?: string; unit?: string }) {
  const max = Math.max(...years.map((y) => y.value), 1);
  const short = (v: number) => (v >= 1000 ? `${formatNumber(Math.round(v / 100) / 10)}k` : formatNumber(v));
  return (
    <figure className="m-0 flex flex-col gap-2">
      <figcaption className="type-kicker text-text-muted">{title}</figcaption>
      <svg viewBox="0 0 600 120" className="h-auto w-full text-accent-default" role="img" aria-label={`${title}: ${years.map((y) => `${y.year} — ${formatNumber(y.value)} ${unit}`).join(', ')}`}>
        {years.map((y, i) => {
          const w = 600 / years.length;
          const h = Math.max(4, (y.value / max) * 72);
          const x = i * w + 4;
          return (
            <g key={y.year}>
              <rect x={x} y={96 - h} width={w - 8} height={h} fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1" />
              <text x={x + (w - 8) / 2} y={90 - h} textAnchor="middle" className="fill-text-muted font-body text-11">
                {short(y.value)}
              </text>
              <text x={x + (w - 8) / 2} y={114} textAnchor="middle" className="fill-text-muted font-body text-11">
                {y.year}
              </text>
            </g>
          );
        })}
        <line x1="0" x2="600" y1="96.5" y2="96.5" className="stroke-border-strong" strokeWidth="1" />
      </svg>
    </figure>
  );
}

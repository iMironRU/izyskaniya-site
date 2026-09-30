// Матрица цен «пятно × этажность» (price-matrix.md): ячейки считает тот же движок, что калькулятор.
import { calculate } from '@/engine/calculate';
import type { Answers, CalcData } from '@/engine/schema';
import { formatMoney } from '@/lib/format';

export interface MatrixConfig {
  title: string;
  sub?: string;
  row_axis: string;
  rows: Array<{ label: string; dims: string }>;
  cols: Array<{ label: string; answers: Answers }>;
  base: { preset: string; answers: Answers };
}

export function computeMatrix(data: CalcData, m: MatrixConfig, limit?: { rows?: number; cols?: number }) {
  const preset = data.presets?.[m.base.preset];
  if (!preset) throw new Error(`Матрица «${m.title}»: нет сценария «${m.base.preset}»`);
  const rows = m.rows.slice(0, limit?.rows);
  const cols = m.cols.slice(0, limit?.cols);
  const cells = rows.map((r) =>
    cols.map((c) => {
      const p = calculate(data, { ...preset.answers, ...m.base.answers, dims: r.dims, ...c.answers }).price;
      return p.kind === 'exact' ? formatMoney(p.total) : `от ${formatMoney(p.min)}`;
    }),
  );
  return { rows: rows.map((r) => r.label), cols: cols.map((c) => c.label), cells };
}

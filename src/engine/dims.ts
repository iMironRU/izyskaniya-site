// Габариты «длина × ширина» хранятся строкой «12×9» — одно значение на один шаг квиза.
export interface Dims {
  length: number;
  width: number;
}

export function parseDims(v: unknown): Dims | null {
  if (typeof v !== 'string') return null;
  const m = v.replace(/\s/g, '').replace(/,/g, '.').match(/^(\d+(?:\.\d+)?)[x×*х](\d+(?:\.\d+)?)$/i);
  if (!m) return null;
  const length = Number(m[1]);
  const width = Number(m[2]);
  return Number.isFinite(length) && Number.isFinite(width) ? { length, width } : null;
}

export const formatDims = (d: Dims) => `${d.length}×${d.width}`;

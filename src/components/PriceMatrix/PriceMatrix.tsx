'use client';

import { useState, type ReactNode } from 'react';
import { Segmented } from '../Segmented/Segmented';

export interface PriceMatrixProps {
  caption: string;
  sub?: string;
  rowAxis: string;
  rows: string[];
  cols: string[];
  /** cells[row][col] — цены из той же модели, что калькулятор (priceMatrix) */
  cells: ReactNode[][];
  name: string;
}

/**
 * components/price-matrix.md — правило Б: на десктопе таблица, на телефоне одно измерение
 * выбирается сегментным переключателем, остальное — список. Горизонтальной прокрутки нет.
 */
export function PriceMatrix({ caption, sub, rowAxis, rows, cols, cells, name }: PriceMatrixProps) {
  const [col, setCol] = useState('0');
  const c = Number(col);
  return (
    <figure className="m-0 flex flex-col gap-3">
      <figcaption className="flex flex-col gap-1">
        <span className="type-h3">{caption}</span>
        {sub ? <span className="type-body text-text-secondary">{sub}</span> : null}
      </figcaption>

      <div className="flex flex-col gap-3 md:hidden">
        <Segmented name={name} label={caption} block value={col} onChange={setCol} options={cols.map((l, i) => ({ value: String(i), label: l }))} />
        <dl className="m-0 border-t border-border-strong">
          {rows.map((r, i) => (
            <div key={r} className="flex items-baseline justify-between gap-3 border-b border-table-rule py-3">
              <dt className="type-body">{r}</dt>
              <dd className="m-0 font-heading text-20 nums">{cells[i][c]}</dd>
            </div>
          ))}
        </dl>
      </div>

      <table className="hidden w-full border-collapse type-body md:table">
        <thead>
          <tr className="border-b border-table-rule">
            <th scope="col" className="p-table-cell-padding text-left text-table font-regular tracking-label text-text-muted uppercase">
              {rowAxis}
            </th>
            {cols.map((h) => (
              <th key={h} scope="col" className="p-table-cell-padding text-right text-table font-regular tracking-label text-text-muted uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r} className="border-b border-table-rule hover:bg-row-hover">
              <th scope="row" className="p-table-cell-padding text-left font-heading text-20 font-regular">
                {r}
              </th>
              {cells[i].map((cell, j) => (
                <td key={cols[j]} className="p-table-cell-padding text-right font-heading text-20 nums">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

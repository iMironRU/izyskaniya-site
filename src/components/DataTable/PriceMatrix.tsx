import type { ReactNode } from 'react';

export interface PriceMatrixProps {
  caption: string;
  rowAxis: string;
  colAxis: string;
  rows: string[];
  cols: string[];
  /** cells[row][col] — обычно <PriceTag /> из priceMatrix() */
  cells: ReactNode[][];
}

export function PriceMatrix({ caption, rowAxis, colAxis, rows, cols, cells }: PriceMatrixProps) {
  return (
    <figure className="m-0 flex flex-col gap-2">
      <figcaption className="flex flex-col gap-1">
        <span className="text-md font-semibold">{caption}</span>
        <span className="text-sm text-text-secondary">
          Строки — {rowAxis.toLowerCase()}, столбцы — {colAxis.toLowerCase()}.<span className="md:hidden"> Таблица прокручивается вбок.</span>
        </span>
      </figcaption>
      <div role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto border-t border-table-rule-strong">
        <table className="w-full border-collapse text-md">
          <thead>
            <tr className="border-b border-table-rule-strong bg-table-head-bg">
              <th scope="col" className="sticky left-0 bg-table-head-bg px-3 py-2 text-left text-sm font-semibold whitespace-nowrap text-text-secondary">
                {rowAxis}
              </th>
              {cols.map((c) => (
                <th key={c} scope="col" className="px-3 py-2 text-right text-sm font-semibold whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r} className="border-b border-table-rule">
                <th scope="row" className="sticky left-0 border-r border-table-rule bg-bg-page px-3 py-3 text-left font-semibold whitespace-nowrap">
                  {r}
                </th>
                {cells[i].map((cell, j) => (
                  <td key={cols[j]} className="px-3 py-3 text-right whitespace-nowrap tabular-nums">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

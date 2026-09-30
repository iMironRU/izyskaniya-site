import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Column<Row> {
  key: string;
  header: string;
  cell: (row: Row) => ReactNode;
  align?: 'start' | 'end';
  /** Главная колонка: заголовок карточки на телефоне */
  primary?: boolean;
}

export interface DataTableProps<Row> {
  caption: string;
  captionHidden?: boolean;
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Итоговая строка: подпись и значение для последней колонки */
  footer?: { label: string; value: ReactNode };
}

export function DataTable<Row>({ caption, captionHidden, columns, rows, rowKey, footer }: DataTableProps<Row>) {
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const rest = columns.filter((c) => c !== primary);

  return (
    <div>
      {/* Телефон: строки → карточки. display:none скрывает дубль и от скринридеров. */}
      <div className="md:hidden">
        <p className={cn('mt-0 mb-3 text-md font-semibold', captionHidden && 'sr-only')}>{caption}</p>
        <ul className="m-0 flex list-none flex-col border-t border-table-rule-strong p-0">
          {rows.map((row) => (
            <li key={rowKey(row)} className="flex flex-col gap-2 border-b border-table-rule py-3">
              <span className="text-md font-semibold">{primary.cell(row)}</span>
              <dl className="m-0 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                {rest.map((c) => (
                  <div key={c.key} className="contents">
                    <dt className="text-text-secondary">{c.header}</dt>
                    <dd className={cn('m-0 tabular-nums', c.align === 'end' && 'text-right')}>{c.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        {footer ? (
          <div className="flex items-baseline justify-between gap-3 border-t border-table-rule-strong py-3 font-semibold">
            <span>{footer.label}</span>
            <span className="tabular-nums">{footer.value}</span>
          </div>
        ) : null}
      </div>

      <table className="hidden w-full border-collapse text-md md:table">
        <caption className={cn('mb-3 text-left text-md font-semibold', captionHidden && 'sr-only')}>{caption}</caption>
        <thead>
          <tr className="border-t border-b border-table-rule-strong bg-table-head-bg">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('px-3 py-2 text-sm font-semibold', c.align === 'end' ? 'text-right' : 'text-left')}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-table-rule align-top">
              {columns.map((c) =>
                c === primary ? (
                  <th key={c.key} scope="row" className="px-3 py-3 text-left font-semibold">
                    {c.cell(row)}
                  </th>
                ) : (
                  <td key={c.key} className={cn('px-3 py-3 tabular-nums', c.align === 'end' && 'text-right')}>
                    {c.cell(row)}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
        {footer ? (
          <tfoot>
            <tr className="border-t border-table-rule-strong">
              <th scope="row" colSpan={columns.length - 1} className="px-3 py-3 text-left">
                {footer.label}
              </th>
              <td className="px-3 py-3 text-right font-semibold tabular-nums">{footer.value}</td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ShowAll } from './ShowAll';

export interface Column<Row> {
  key: string;
  header: string;
  cell: (row: Row) => ReactNode;
  align?: 'start' | 'end';
  /** Главная колонка: заголовок карточки на телефоне */
  primary?: boolean;
}

export interface TableProps<Row> {
  caption: string;
  captionHidden?: boolean;
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  footer?: { label: ReactNode; value: ReactNode };
  /** Правило В: длинная таблица — первые N строк и «Показать все» (по умолчанию 5, если строк больше 6) */
  collapseAfter?: number;
}

/**
 * components/table.md. Горизонтальной прокрутки нет нигде.
 * Правило А: справочная таблица на телефоне превращается в карточки (1-я колонка — заголовок, остальное — пары).
 * Правило В: >6 строк — первые 5 и кнопка «Показать все».
 */
export function Table<Row>({ caption, captionHidden, columns, rows, rowKey, footer, collapseAfter }: TableProps<Row>) {
  const limit = collapseAfter ?? (rows.length > 6 ? 5 : rows.length);
  // Серверный компонент: все строки в разметке, лишние скрыты до «Показать все» (data-expanded у обёртки).
  const extra = (i: number) => i >= limit;
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const rest = columns.filter((c) => c !== primary);

  return (
    <div data-table className="group flex flex-col gap-3">
      {/* Телефон: карточки. display:none скрывает дубль и от скринридеров. */}
      <div className="md:hidden">
        <p className={cn('mt-0 mb-2 type-kicker text-text-muted', captionHidden && 'sr-only')}>{caption}</p>
        <ul className="m-0 flex list-none flex-col border-t border-border-strong p-0">
          {rows.map((row, i) => (
            <li key={rowKey(row)} className={cn('flex-col gap-2 border-b border-table-rule py-3', extra(i) ? 'hidden group-data-expanded:flex' : 'flex')}>
              <span className="font-heading text-18 leading-heading font-semibold">{primary.cell(row)}</span>
              <dl className="m-0 flex flex-col gap-1">
                {rest.map((c) => (
                  <div key={c.key} className="flex items-baseline justify-between gap-3 type-small">
                    <dt className="text-text-muted">{c.header}</dt>
                    <dd className="m-0 text-right text-text-default nums">{c.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        {footer ? (
          <div className="flex items-baseline justify-between gap-3 border-b border-border-strong py-3 font-heading text-18 font-semibold nums">
            <span>{footer.label}</span>
            <span>{footer.value}</span>
          </div>
        ) : null}
      </div>

      <table className="hidden w-full border-collapse type-body md:table">
        <caption className={cn('mb-2 text-left type-kicker text-text-muted', captionHidden && 'sr-only')}>{caption}</caption>
        <thead>
          <tr className="border-b border-table-rule">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('p-table-cell-padding text-table font-regular tracking-label text-text-muted uppercase', c.align === 'end' ? 'text-right' : 'text-left')}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row)} className={cn('border-b border-table-rule align-top hover:bg-row-hover', extra(i) && 'hidden group-data-expanded:table-row')}>
              {columns.map((c) =>
                c === primary ? (
                  <th key={c.key} scope="row" className="p-table-cell-padding text-left font-regular">
                    {c.cell(row)}
                  </th>
                ) : (
                  <td key={c.key} className={cn('p-table-cell-padding nums', c.align === 'end' && 'text-right')}>
                    {c.cell(row)}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
        {footer ? (
          <tfoot>
            <tr className="border-b border-border-strong">
              <th scope="row" colSpan={columns.length - 1} className="p-table-cell-padding text-left font-heading text-18 font-semibold">
                {footer.label}
              </th>
              <td className="p-table-cell-padding text-right font-heading text-18 font-semibold nums">{footer.value}</td>
            </tr>
          </tfoot>
        ) : null}
      </table>

      {rows.length > limit ? (
        <div>
          <ShowAll total={rows.length} />
        </div>
      ) : null}
    </div>
  );
}

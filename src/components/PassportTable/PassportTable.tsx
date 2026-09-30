import type { ReactNode } from 'react';
import { CopyButton } from '../CopyButton/CopyButton';

export interface PassportItem {
  key: string;
  value: ReactNode;
  /** Строка для копирования (реквизиты) */
  copy?: string;
}

/** components/passport-table.md — «ключ — значение»: desktop 34/66, на телефоне ключ над значением. */
export function PassportTable({ items, copyAll }: { items: PassportItem[]; copyAll?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <dl className="m-0 border-t border-border-strong">
        {items.map((it) => (
          <div key={it.key} className="flex flex-col gap-1 border-b border-border-default py-3 md:flex-row md:items-baseline md:gap-4">
            <dt className="type-small text-text-muted md:w-1/3 md:shrink-0">{it.key}</dt>
            <dd className="m-0 flex flex-1 flex-wrap items-baseline justify-between gap-2 type-body text-text-default nums">
              <span>{it.value}</span>
              {it.copy ? <CopyButton value={it.copy} /> : null}
            </dd>
          </div>
        ))}
      </dl>
      {copyAll ? (
        <div>
          <CopyButton value={copyAll} label="Копировать все" />
        </div>
      ) : null}
    </div>
  );
}

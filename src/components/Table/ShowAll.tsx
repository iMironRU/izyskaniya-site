'use client';

import { useState } from 'react';
import { Button } from '../Button/Button';

/** Правило В: «Показать все» — переключает data-expanded у ближайшей обёртки таблицы. */
export function ShowAll({ total }: { total: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Button
      variant="secondary"
      aria-expanded={open}
      onClick={(e) => {
        const box = (e.currentTarget as HTMLElement).closest('[data-table]');
        box?.toggleAttribute('data-expanded', !open);
        setOpen(!open);
      }}
    >
      {open ? 'Свернуть' : `Показать все (${total})`}
    </Button>
  );
}

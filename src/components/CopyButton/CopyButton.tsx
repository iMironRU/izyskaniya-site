'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { useToast } from '../Toast/Toast';

/** components/copy-button.md — «Копировать» → «Скопировано» 2 с; ошибка — тост. */
export function CopyButton({ value, label = 'Копировать', doneLabel = 'Скопировано' }: { value: string; label?: string; doneLabel?: string }) {
  const [done, setDone] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 2000);
    return () => clearTimeout(t);
  }, [done]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
    } catch {
      toast('Не удалось скопировать', 'error');
    }
  };

  return (
    <Button variant="ghost" compact onClick={copy} iconStart={done ? <Check className="size-16" strokeWidth={1.5} aria-hidden="true" /> : <Copy className="size-16" strokeWidth={1.5} aria-hidden="true" />}>
      <span aria-live="polite">{done ? doneLabel : label}</span>
    </Button>
  );
}

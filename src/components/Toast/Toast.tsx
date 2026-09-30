'use client';

import { cn } from '@/lib/cn';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type Tone = 'success' | 'error' | 'info';
interface Item {
  id: number;
  text: string;
  tone: Tone;
}

const Ctx = createContext<(text: string, tone?: Tone) => void>(() => {});

/** components/toast.md — role=status, авто-скрытие 2,5 с, над sticky-bar на мобильном. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const push = useCallback((text: string, tone: Tone = 'info') => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, text, tone }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 2500);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-sticky-bar-height z-30 flex flex-col items-center gap-2 px-4 md:bottom-8">
        {items.map((t) => (
          <ToastView key={t.id} tone={t.tone}>
            {t.text}
          </ToastView>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function ToastView({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <p className={cn('m-0 rounded-md border bg-bg-default px-4 py-3 type-body shadow-md', tone === 'error' ? 'border-status-error-border text-status-error' : 'border-toast-border text-text-default')}>
      {children}
    </p>
  );
}

export const useToast = () => useContext(Ctx);

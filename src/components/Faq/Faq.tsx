import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';

export interface FaqItem {
  question: string;
  answer: ReactNode;
  /** Открыт изначально */
  open?: boolean;
}

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-border-strong">
      {items.map((item) => (
        <details key={item.question} open={item.open} className="group border-b border-border-default">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-semibold">
            {item.question}
            <Plus className="size-5 shrink-0 transition-transform group-open:rotate-45" strokeWidth={1.75} aria-hidden="true" />
          </summary>
          <div className="pb-4 text-md leading-normal text-text-secondary">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}

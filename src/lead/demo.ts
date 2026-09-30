// Заглушка: заявка никуда не уходит, форма показывает все состояния.
// Используется, пока не подключены реальные адаптеры (этап 7) и на GitHub Pages.
import type { LeadSender } from './types';

export const demoSender: LeadSender = {
  async send(lead) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return { ok: false, reason: 'offline' };
    await new Promise((r) => setTimeout(r, 600));
    console.info('[demo] заявка не отправлена, это заглушка:', lead);
    return { ok: true };
  },
};

// Интерфейс отправки заявок. Реализации (Telegram, email через PHP-эндпоинт) — этап 7.
import type { Answers, Price } from '@/engine/schema';

export type ContactMethod = 'call' | 'telegram' | 'whatsapp';

export interface Lead {
  name: string;
  phone: string;
  contact: ContactMethod;
  cadastral?: string;
  point?: { lat: number; lng: number };
  answers: Answers;
  price: Price;
  pricing_version: string;
  share_url: string;
}

export type SendResult = { ok: true } | { ok: false; reason: 'offline' | 'error'; message?: string };

export interface LeadSender {
  send(lead: Lead): Promise<SendResult>;
}

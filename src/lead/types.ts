// Интерфейс отправки заявок. Реализации (Telegram, email через PHP-эндпоинт) — этап 7.
import type { Answers, Price } from '@/engine/schema';

export type ContactMethod = 'call' | 'telegram' | 'whatsapp';

interface Contact {
  name: string;
  /** Для ТЗ контакт на выбор: телефон или почта (хотя бы одно) */
  phone: string;
  email?: string;
  /** Страница, с которой отправлена заявка */
  page?: string;
}

/** «Перезвоните мне» */
export interface CallbackLead extends Contact {
  kind: 'callback';
  comment?: string;
}

/** «Отправить ТЗ» — с файлом */
export interface TzLead extends Contact {
  kind: 'tz';
  /** Где объект: адрес, кадастровый номер, координаты — как удобно */
  location?: string;
  /** Когда нужен результат */
  when?: string;
  comment?: string;
  /** ТЗ, границы (kml/kmz, dwg/dxf, координаты), скриншоты карты */
  files: File[];
}

/** Контакт после результата калькулятора */
export interface CalcLead extends Contact {
  kind: 'calc';
  contact: ContactMethod;
  cadastral?: string;
  point?: { lat: number; lng: number };
  answers: Answers;
  price: Price;
  pricing_version: string;
  share_url: string;
}

export type Lead = CallbackLead | TzLead | CalcLead;

export type SendResult = { ok: true } | { ok: false; reason: 'offline' | 'error'; message?: string };

export interface LeadSender {
  send(lead: Lead): Promise<SendResult>;
}

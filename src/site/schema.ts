// Схемы данных сайта (не калькулятора).
import { z } from 'zod';

const Link = z.strictObject({ label: z.string(), href: z.string() });

export const Company = z.strictObject({
  name: z.string(),
  brand_note: z.string().optional(),
  legal_name: z.string(),
  inn: z.string(),
  ogrn: z.string(),
  kpp: z.string(),
  bank: z.string(),
  founded: z.string(),
  sro: z.strictObject({ name: z.string(), number: z.string(), url: z.url().nullable() }),
  lab: z.strictObject({ accreditation: z.string() }),
  phone: z.strictObject({ display: z.string(), tel: z.string().regex(/^\+\d{11}$/) }),
  email: z.email(),
  address: z.string(),
  region: z.string(),
  hours: z.string(),
  hours_full: z.string(),
  messengers: z.array(Link),
  registries: z.array(Link),
  rating: z.strictObject({ value: z.string(), count: z.string(), source: z.string(), url: z.url().nullable() }),
  office: z.strictObject({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180), city: z.string() }),
  map: z.strictObject({ zoom: z.number().int().min(1).max(18) }),
  demo: z.boolean(),
});
export type Company = z.infer<typeof Company>;

/** Контакты для шапки, меню, подвала и форм. */
export function contactsOf(c: Company) {
  return {
    phone: c.phone,
    hours: c.hours,
    hoursFull: c.hours_full,
    email: c.email,
    address: c.address,
    messengers: c.messengers,
  };
}

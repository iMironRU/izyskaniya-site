// Схемы данных сайта (не калькулятора).
import { z } from 'zod';

export const Company = z.strictObject({
  name: z.string(),
  legal_name: z.string(),
  inn: z.string(),
  ogrn: z.string(),
  sro: z.strictObject({ name: z.string(), number: z.string(), url: z.url().nullable() }),
  lab: z.strictObject({ accreditation: z.string() }),
  phone: z.strictObject({ display: z.string(), tel: z.string().regex(/^\+\d{11}$/) }),
  email: z.email(),
  address: z.string(),
  hours: z.string(),
  office: z.strictObject({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180), city: z.string() }),
  map: z.strictObject({ zoom: z.number().int().min(1).max(18) }),
  demo: z.boolean(),
});
export type Company = z.infer<typeof Company>;

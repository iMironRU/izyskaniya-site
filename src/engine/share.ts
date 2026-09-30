// Состояние калькулятора в URL: ответы + версия цен. Работает и в браузере, и в Node.
import { z } from 'zod';
import { UNKNOWN, Value, type Answers } from './schema';

const Payload = z.object({
  v: z.literal(1),
  p: z.string(),
  a: z.record(z.string(), z.union([Value, z.literal(UNKNOWN)])),
});

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const fromBase64Url = (s: string) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4)), (c) => c.charCodeAt(0));
};

export function encodeShare(answers: Answers, pricingVersion: string): string {
  const json = JSON.stringify({ v: 1, p: pricingVersion, a: answers });
  return toBase64Url(new TextEncoder().encode(json));
}

/** null — ссылка битая или от несовместимой версии формата. */
export function decodeShare(s: string): { answers: Answers; pricingVersion: string } | null {
  try {
    const parsed = Payload.safeParse(JSON.parse(new TextDecoder().decode(fromBase64Url(s))));
    return parsed.success ? { answers: parsed.data.a, pricingVersion: parsed.data.p } : null;
  } catch {
    return null;
  }
}

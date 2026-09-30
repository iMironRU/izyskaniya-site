// Маршруты сайта (URL из design/handoff/pages/*.md). В данных ссылки пишутся ключом: r: raschet.
export const ROUTES = {
  home: '/',
  uslugi: '/uslugi/',
  geologiya: '/uslugi/geologiya/',
  geodeziya: '/uslugi/geodeziya/',
  'topo-gaz': '/uslugi/geodeziya/topo-gaz/',
  ceny: '/ceny/',
  raschet: '/raschet/',
  chastnym: '/chastnym/',
  proektirovshchikam: '/proektirovshchikam/',
  obrazcy: '/obrazcy/',
  obekty: '/obekty/',
  keys: '/obekty/dom-na-sklone/',
  'o-kompanii': '/o-kompanii/',
  komanda: '/o-kompanii/komanda/',
  laboratoriya: '/o-kompanii/laboratoriya/',
  tehnika: '/o-kompanii/tehnika/',
  dokumenty: '/o-kompanii/dokumenty/',
  'kak-rabotaem': '/kak-rabotaem/',
  proverka: '/proverka-podryadchika/',
  voprosy: '/voprosy/',
  stati: '/stati/',
  statya: '/stati/geologiya-dlya-doma/',
  kontakty: '/kontakty/',
  spasibo: '/spasibo/',
  privacy: '/privacy/',
} as const;

export type RouteKey = keyof typeof ROUTES;

const base = () => process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Ключ маршрута, «tel», «#якорь», «raschet?s=dom» или готовый адрес → href с учётом basePath. */
export function href(r: string | undefined, phoneTel?: string): string {
  if (!r) return '#';
  if (r === 'tel') return `tel:${phoneTel ?? ''}`;
  if (r.startsWith('#') || r.startsWith('http') || r.startsWith('mailto:') || r.startsWith('tel:')) return r;
  const [key, query] = r.split('?');
  const path = (ROUTES as Record<string, string>)[key] ?? (key.startsWith('/') ? key : `/${key}/`);
  return `${base()}${path}${query ? `?${query}` : ''}`;
}

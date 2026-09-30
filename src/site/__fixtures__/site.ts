// Демо-данные для стори шапки и подвала (заглушки из хендоффа). На сайте — из data/.
import type { NavDirection, NavLink, SiteContacts } from '../nav';

export const demoContacts: SiteContacts = {
  phone: { display: '+7 (000) 000-00-00', tel: '+70000000000' },
  hours: 'пн–пт 8:00–19:00',
  hoursFull: 'пн–пт 8:00–19:00, сб 9:00–15:00',
  email: 'info@example.com',
  address: '[Город, улица, дом, офис]',
  messengers: [
    { href: '#', label: 'Telegram' },
    { href: '#', label: 'ВКонтакте' },
    { href: '#', label: 'WhatsApp' },
  ],
};

export const demoLinks: NavLink[] = [
  { href: '/ceny/', label: 'Цены' },
  { href: '/obrazcy/', label: 'Образцы' },
  { href: '/obekty/', label: 'Объекты' },
  { href: '/o-kompanii/', label: 'О компании' },
  { href: '/kontakty/', label: 'Контакты' },
];

const dir = (id: string, title: string, services: string[], from = 'от [цена]'): NavDirection => ({
  id,
  title,
  href: `/uslugi/${id}/`,
  from,
  services: services.map((label) => ({ label, href: `/uslugi/${id}/` })),
});

export const demoDirections: NavDirection[] = [
  dir('geologiya', 'Инженерная геология', ['Геология под частный дом', 'Изыскания под проект и экспертизу', 'Статическое зондирование']),
  dir('geodeziya', 'Геодезия и топосъёмка', ['Топосъёмка для газа и воды', 'Топосъёмка для проекта', 'Вынос осей здания']),
  dir('ekologiya', 'Инженерная экология', ['Экологические изыскания под проект', 'Радиационное обследование']),
  dir('gidromet', 'Гидрометеорология', ['Изыскания под проект']),
];

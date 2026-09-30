// Типы навигации сайта: шапка, панель «Услуги», мобильное меню, подвал.
export interface NavLink {
  href: string;
  label: string;
}

export interface NavDirection {
  id: string;
  title: string;
  href: string;
  /** «от 38 000 ₽» — считается из data/pricing, не пишется руками */
  from?: string;
  services: NavLink[];
}

export interface SiteContacts {
  phone: { display: string; tel: string };
  hours: string;
  hoursFull?: string;
  email: string;
  address: string;
  messengers: NavLink[];
}

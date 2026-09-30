// Загрузка данных сайта на сборке (Node): data/company.yaml, data/site/**.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as parseYaml } from 'js-yaml';
import { z } from 'zod';
import { loadCalcData } from '@/engine/load';
import { calculate } from '@/engine/calculate';
import type { CalcData, Program } from '@/engine/schema';
import { PageSchema, type Page } from './blocks';
import { computePrices, fillDeep, PriceProfiles, type Prices } from './prices';
import { href } from './routes';
import { Company, contactsOf } from './schema';
import type { NavDirection, NavLink, SiteContacts } from './nav';

const read = (file: string) => {
  try {
    return parseYaml(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`${file}: ${(e as Error).message.split('\n')[0]}`);
  }
};

function parse<T>(schema: z.ZodType<T>, value: unknown, file: string): T {
  const r = schema.safeParse(value);
  if (!r.success) throw new Error(`${file}:\n${z.prettifyError(r.error)}`);
  return r.data;
}

export function loadCompany(root = 'data'): Company {
  return parse(Company, read(join(root, 'company.yaml')), 'company.yaml');
}

export function loadPriceProfiles(root = 'data') {
  return parse(PriceProfiles, read(join(root, 'site', 'prices.yaml')), 'site/prices.yaml');
}

/** Реквизиты компании в текстах: {{inn}}, {{sro}}, {{phone}} … — одна истина в data/company.yaml. */
function companyVars(c: Company): Record<string, string> {
  return {
    name: c.name,
    legal_name: c.legal_name,
    inn: c.inn,
    kpp: c.kpp,
    bank: c.bank,
    ogrn: c.ogrn,
    sro: c.sro.number,
    lab: c.lab.accreditation,
    founded: c.founded,
    phone: c.phone.display,
    email: c.email,
    address: c.address,
    region: c.region,
    rating: `${c.rating.value} · ${c.rating.count}`,
  };
}

function fillCompany<T>(v: T, vars: Record<string, string>): T {
  if (typeof v === 'string') {
    return v.replace(/\{\{([a-z_]+)\}\}/g, (m, k: string) => {
      if (!(k in vars)) throw new Error(`Нет реквизита компании «${k}» (data/company.yaml)`);
      return vars[k];
    }) as T;
  }
  if (Array.isArray(v)) return v.map((x) => fillCompany(x, vars)) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fillCompany(x, vars)])) as T;
  return v;
}

const Direction = z.strictObject({
  id: z.string(),
  title: z.string(),
  short: z.string(),
  text: z.string(),
  price: z.string(),
  tasks: z.array(z.string()),
  page: z.boolean().optional(),
  services: z.array(z.strictObject({ title: z.string(), r: z.string(), price: z.string().optional() })),
});
export type Direction = z.infer<typeof Direction>;

const NavFile = z.strictObject({
  header: z.array(z.strictObject({ label: z.string(), r: z.string() })),
  footer_sections: z.array(z.strictObject({ label: z.string(), r: z.string() })),
});

export interface SiteDirection extends Direction {
  href: string;
  from: string;
  days: string;
}

export interface Site {
  company: Company;
  contacts: SiteContacts;
  calc: CalcData;
  prices: Prices;
  directions: SiteDirection[];
  nav: { header: NavLink[]; sections: NavLink[]; directions: NavDirection[] };
  /** Контент страницы с подставленными реквизитами и ценами */
  content: <T = unknown>(name: string) => T;
  page: (key: string) => Page;
  pageKeys: string[];
  /** Текст цены профиля: «от 38 000 ₽», «49 000 ₽», «8 дней» */
  price: (key: string, kind?: 'от' | 'цена' | 'срок' | 'дни') => string;
  /** Полный расчёт профиля (preset) — для «Типового объёма»: скважины, глубина */
  program: (key: string) => Program;
}

let cache: Site | null = null;

/** Всё для сборки сайта. Любая ошибка в данных — ошибка сборки. */
export function loadSite(root = 'data'): Site {
  if (cache) return cache;
  const company = loadCompany(root);
  const calc = loadCalcData(root);
  const profiles = loadPriceProfiles(root);
  const prices = computePrices(calc, profiles);
  const vars = companyVars(company);
  const fill = <T>(v: T): T => fillDeep(fillCompany(v, vars), prices);
  const priceOf = (key: string, kind: 'от' | 'дни') => fill(`{{${kind}:${key}}}`);

  const directions = parse(z.array(Direction), read(join(root, 'site', 'directions.yaml')), 'site/directions.yaml').map((d) => ({
    ...d,
    href: href(d.page ? d.id : `uslugi#${d.id}`),
    from: priceOf(d.price, 'от'),
    days: priceOf(d.price, 'дни'),
  }));
  const navFile = parse(NavFile, read(join(root, 'site', 'nav.yaml')), 'site/nav.yaml');
  const toLink = (l: { label: string; r: string }) => ({ label: l.label, href: href(l.r) });

  const pagesDir = join(root, 'site', 'pages');
  const pageKeys = readdirSync(pagesDir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => f.replace(/\.yaml$/, ''));
  const pages = Object.fromEntries(pageKeys.map((k) => [k, fill(parse(PageSchema, read(join(pagesDir, `${k}.yaml`)), `site/pages/${k}.yaml`) as unknown as Page)]));

  cache = {
    company,
    contacts: contactsOf(company),
    calc,
    prices,
    directions,
    nav: {
      header: navFile.header.map(toLink),
      sections: navFile.footer_sections.map(toLink),
      directions: directions.map((d) => ({
        id: d.id,
        title: d.title,
        href: d.href,
        from: d.from,
        services: d.services.map((s) => ({ label: s.title, href: href(s.r) })),
      })),
    },
    content: <T>(name: string) => fill(read(join(root, 'site', `${name}.yaml`))) as T,
    page: (key: string) => {
      const p = pages[key];
      if (!p) throw new Error(`Нет страницы data/site/pages/${key}.yaml`);
      return p;
    },
    pageKeys,
    price: (key, kind = 'от') => fill(`{{${kind}:${key}}}`),
    program: (key) => {
      const p = profiles[key];
      if (!p || !('preset' in p)) throw new Error(`prices.yaml «${key}»: нужен профиль с preset`);
      return calculate(calc, { ...calc.presets![p.preset].answers, ...p.answers });
    },
  };
  return cache;
}

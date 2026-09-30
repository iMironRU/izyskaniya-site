// Блочные страницы (design/handoff/prototype/pages-data.js → data/site/pages/*.yaml).
// Схема «{ type, … }» — контракт и для будущей CMS. Типы проверяются на сборке.
import { z } from 'zod';

export const BLOCK_TYPES = [
  'hero', 'timeline', 'compare', 'cards', 'annotated', 'faq', 'rows', 'table', 'docs', 'norms', 'person',
  'stats', 'map', 'kv', 'result', 'logos', 'people', 'checks', 'callout', 'article', 'contacts', 'error',
] as const;

export type Link = string; // ключ маршрута, 'tel', '#якорь' или URL
export type Crumb = string | [string, Link];

export interface HeroBlock { type: 'hero'; crumbs?: Crumb[]; kicker?: string; h1: string; lead?: string; actions?: Array<{ t: string; r: Link; primary?: boolean }>; form?: 'tz' | 'callback'; facts?: Array<{ k: string; v: string }>; check?: boolean }
export interface TimelineBlock { type: 'timeline'; id?: string; title?: string; sub?: string; you?: boolean; photos?: boolean; items: Array<{ w?: string; t: string; d?: string; tag?: string; p?: string; r?: Link; you?: string }> }
export interface CompareBlock { type: 'compare'; id?: string; title: string; text?: string; items: Array<{ v: string; k: string }>; note?: string }
export interface CardItem { tag?: string; kicker?: string; t: string; d?: string; meta?: string; r?: Link; ph?: string; facts?: string[] }
export interface CardsBlock { type: 'cards'; id?: string; title?: string; min?: number; link?: [string, Link]; viewer?: boolean; filter?: string[]; items: CardItem[]; callouts?: Array<{ t: string; d: string }> }
export interface AnnotatedBlock { type: 'annotated'; id?: string; title: string; ph: string; items: Array<{ t: string; d: string }> }
export interface FaqBlock { type: 'faq'; id?: string; title?: string; search?: boolean; groups?: string[]; items: Array<{ q: string; a: string; g?: string }> }
export interface RowsBlock { type: 'rows'; title?: string; note?: string; items: Array<{ t: string; d?: string; l?: string; r?: Link }> }
export interface TableBlock { type: 'table'; title?: string; sub?: string; cols: string[]; rows: string[][]; normCol?: number }
export interface DocsBlock { type: 'docs'; title?: string; all?: string; items: Array<{ t: string; m: string }> }
export interface NormsBlock { type: 'norms'; title?: string; items: Array<[string, string, string]> }
export interface PersonBlock { type: 'person'; title: string; n: string; r: string; x?: string; phone?: string; email?: string }
export interface StatsBlock { type: 'stats'; title?: string; items: Array<{ v: string; k: string }>; years?: Array<[number, number]> }
export interface MapBlock { type: 'map'; filter?: string[]; items: Array<{ tag: string; kicker: string; t: string; d?: string; fig?: string; ph?: string; r?: Link; x: number; y: number }> }
export interface KvBlock { type: 'kv'; title?: string; items: Array<[string, string]>; copy?: boolean; link?: [string, Link] }
export interface ResultBlock { type: 'result'; v: string; d?: string }
export interface LogosBlock { type: 'logos'; title?: string; n: number }
export interface PeopleBlock { type: 'people'; title?: string; lead?: boolean; items: Array<{ n: string; r: string; x?: string; e?: string }> }
export interface ChecksBlock { type: 'checks'; items: Array<{ t: string; why?: string; how?: string; l?: string; bad?: string; ours?: string }> }
export interface CalloutBlock { type: 'callout'; t: string; d?: string; form?: 'callback' | 'tz' }
export type Para = ['h', string] | ['p', string] | ['quote', string, string] | ['callout', string, string] | ['table', string[], string[][]];
export interface ArticleBlock { type: 'article'; toc?: string[]; paras: Para[]; author?: { n: string; r: string }; related?: { t: string; r: Link } }
export interface ContactsBlock { type: 'contacts' }
export interface ErrorBlock { type: 'error' }

export type Block =
  | HeroBlock | TimelineBlock | CompareBlock | CardsBlock | AnnotatedBlock | FaqBlock | RowsBlock | TableBlock | DocsBlock | NormsBlock | PersonBlock
  | StatsBlock | MapBlock | KvBlock | ResultBlock | LogosBlock | PeopleBlock | ChecksBlock | CalloutBlock | ArticleBlock | ContactsBlock | ErrorBlock;

export interface Page {
  title: string;
  toc?: boolean;
  narrow?: boolean;
  noCta?: boolean;
  blocks: Block[];
}

/** Лёгкая проверка на сборке: известные типы блоков и обязательные поля страницы. */
export const PageSchema = z.object({
  title: z.string(),
  toc: z.boolean().optional(),
  narrow: z.boolean().optional(),
  noCta: z.boolean().optional(),
  blocks: z.array(z.object({ type: z.enum(BLOCK_TYPES) }).passthrough()).min(1),
});

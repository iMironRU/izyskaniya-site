// Рендер блочных страниц (data/site/pages/*.yaml). Схема блоков — src/site/blocks.ts.
import { CircleCheck } from 'lucide-react';
import { ButtonLink } from '@/components/Button/Button';
import { FaqAccordion } from '@/components/FaqAccordion/FaqAccordion';
import { MiniChart } from '@/components/MiniChart/MiniChart';
import { PassportTable } from '@/components/PassportTable/PassportTable';
import { Plate } from '@/components/Plate/Plate';
import { ArrowLink, Breadcrumbs, Callout, FactFigure, Kicker, Lead, NormLink, NormQuote, SectionHeading, Tag } from '@/components/Primitives/Primitives';
import { Table } from '@/components/Table/Table';
import { Timeline } from '@/components/Timeline/Timeline';
import { DocumentCard, LogoCard, PersonCard } from '@/components/Cards/Cards';
import { cn } from '@/lib/cn';
import type { Block, Crumb, Page } from '../blocks';
import type { Site } from '../load';
import { href } from '../routes';
import { CardsGrid, FormButton, InlineForm, ObjectsMapBlock } from './Interactive';
import { Container, Section } from './Layout';

const gridFor = (min?: number) => (!min ? 'grid-auto-card' : min <= 200 ? 'grid-auto-person' : min <= 240 ? 'grid-auto-sample' : min <= 270 ? 'grid-auto-card' : 'grid-auto-wide');
const slug = (s: string) => s.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, '');

interface Ctx {
  site: Site;
  narrow?: boolean;
}

export function PageBlocks({ page, site }: { page: Page; site: Site }) {
  const ctx: Ctx = { site, narrow: page.narrow };
  const [hero, ...rest] = page.blocks;
  // Оглавление (toc): чипы по заголовкам блоков с id.
  const toc = page.toc ? rest.filter((b) => 'id' in b && b.id && 'title' in b && b.title).map((b) => ({ id: (b as { id: string }).id, label: (b as { title: string }).title })) : [];
  return (
    <>
      <BlockView block={hero} ctx={ctx} toc={toc} />
      {rest.map((b, i) => (
        <BlockView key={i} block={b} ctx={ctx} />
      ))}
    </>
  );
}

function crumbs(list: Crumb[]) {
  return list.map((c) => (typeof c === 'string' ? { label: c } : { label: c[0], href: href(c[1]) }));
}

function BlockView({ block: b, ctx, toc }: { block: Block; ctx: Ctx; toc?: Array<{ id: string; label: string }> }) {
  const { site } = ctx;
  const privacyHref = href('privacy');
  const thanksHref = href('spasibo');
  const tel = site.contacts.phone.tel;
  const wrap = (children: React.ReactNode, id?: string, label?: string) => (
    <Section id={id} label={label}>
      <Container narrow={ctx.narrow}>{children}</Container>
    </Section>
  );

  switch (b.type) {
    case 'hero':
      return (
        <Container narrow={ctx.narrow} className="flex flex-col gap-6 pt-8 pb-4">
          {b.crumbs ? <Breadcrumbs items={crumbs(b.crumbs)} /> : null}
          {b.check ? <CircleCheck className="size-12 text-accent-default" strokeWidth={1.25} aria-hidden="true" /> : null}
          {b.kicker ? <Kicker>{b.kicker}</Kicker> : null}
          <h1 className="m-0 max-w-measure type-display">{b.h1}</h1>
          {b.lead ? <Lead>{b.lead}</Lead> : null}
          {b.facts?.length ? (
            <div className="flex flex-wrap gap-8">
              {b.facts.map((f, i) => (
                <FactFigure key={f.k} value={f.v} label={f.k} divider={i > 0} />
              ))}
            </div>
          ) : null}
          {b.actions?.length || b.form ? (
            <div className="flex flex-wrap gap-3">
              {b.actions?.map((a) => (
                <ButtonLink key={a.t} href={href(a.r, tel)} variant={a.primary ? 'primary' : 'secondary'}>
                  {a.t}
                </ButtonLink>
              ))}
              {b.form ? <FormButton label={b.form === 'tz' ? 'Отправить ТЗ' : 'Перезвоните мне'} kind={b.form} contacts={site.contacts} privacyHref={privacyHref} thanksHref={thanksHref} /> : null}
            </div>
          ) : null}
          {toc?.length ? (
            <nav aria-label="Разделы страницы" className="border-t border-border-default pt-4">
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="inline-flex min-h-8 items-center rounded-sm bg-tag-neutral-bg px-3 text-14 text-tag-neutral-text no-underline hover:text-text-accent-strong">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </Container>
      );

    case 'timeline':
      return wrap(
        <div className="flex flex-col gap-6">
          {b.title ? <SectionHeading title={b.title} sub={b.sub} /> : null}
          <Timeline
            rule={b.you ? 'strong' : 'accent'}
            items={b.items.map((it) => ({
              title: it.t,
              term: it.w,
              text: it.d,
              tag: it.tag,
              price: it.p,
              you: b.you ? it.you : undefined,
              photo: b.photos ? <Plate label={`фото: ${it.t.toLowerCase()}`} ratio="4/3" /> : undefined,
            }))}
          />
        </div>,
        b.id,
      );

    case 'compare':
      return wrap(
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <SectionHeading title={b.title} />
            {b.text ? <p className="m-0 type-body text-text-secondary">{b.text}</p> : null}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-8">
              {b.items.map((it, i) => (
                <FactFigure key={it.k} value={it.v} label={it.k} divider={i > 0} />
              ))}
            </div>
            {b.note ? <p className="m-0 type-small text-text-muted">{b.note}</p> : null}
          </div>
        </div>,
        b.id,
      );

    case 'cards':
      return wrap(
        <div className="flex flex-col gap-6">
          {b.title ? <SectionHeading title={b.title} link={b.link ? { label: b.link[0], href: href(b.link[1]) } : undefined} /> : null}
          <CardsGrid
            name={b.id ?? slug(b.title ?? 'cards')}
            grid={gridFor(b.min)}
            filter={b.filter}
            viewer={b.viewer}
            callouts={b.callouts}
            items={b.items.map((it) => ({ tag: it.tag, kicker: it.kicker, title: it.t, text: it.d, meta: it.meta, href: it.r ? href(it.r) : undefined, ph: it.ph, facts: it.facts }))}
          />
        </div>,
        b.id,
      );

    case 'annotated':
      return wrap(
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative">
            <Plate label={b.ph} ratio="3/4" />
          </div>
          <div className="flex flex-col gap-4">
            <SectionHeading title={b.title} />
            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              {b.items.map((it, i) => (
                <li key={it.t} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent-default font-heading text-18 text-text-accent nums">{i + 1}</span>
                  <span className="flex flex-col gap-1">
                    <span className="type-title-card">{it.t}</span>
                    <span className="type-body text-text-secondary">{it.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>,
        b.id,
      );

    case 'faq':
      return wrap(
        <div className={cn('grid gap-8', !ctx.narrow && 'md:grid-cols-3')}>
          {b.title ? (
            <div>
              <SectionHeading title={b.title} />
            </div>
          ) : null}
          <div className={cn(!ctx.narrow && b.title && 'md:col-span-2')}>
            <FaqAccordion name={b.id ?? 'faq'} search={b.search} groups={b.groups} items={b.items.map((it) => ({ q: it.q, a: it.a, group: it.g }))} />
          </div>
        </div>,
        b.id ?? 'faq',
      );

    case 'rows':
      return wrap(
        <div className="flex flex-col gap-4">
          {b.title ? <SectionHeading title={b.title} /> : null}
          <ol className="m-0 flex list-none flex-col border-t border-border-strong p-0">
            {b.items.map((it, i) => (
              <li key={it.t} className="flex gap-4 border-b border-border-default py-3">
                <span className="w-6 shrink-0 font-heading text-18 text-text-accent nums">{i + 1}</span>
                <span className="flex flex-1 flex-col gap-1">
                  <span className="type-body text-text-default">{it.t}</span>
                  {it.d ? <span className="type-small text-text-muted">{it.d}</span> : null}
                </span>
                {it.l ? (
                  <a href={it.r ? href(it.r) : '#'} className="shrink-0 type-small text-text-accent underline underline-offset-4">
                    {it.l}
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
          {b.note ? <p className="m-0 type-small text-text-muted">{b.note}</p> : null}
        </div>,
      );

    case 'table': {
      const cols = b.normCol !== undefined && b.cols.length === b.normCol ? [...b.cols, 'Норматив'] : b.cols;
      return wrap(
        <div className="flex flex-col gap-4">
          {b.title ? <SectionHeading title={b.title} sub={b.sub} /> : null}
          <Table<string[]>
            caption={b.title ?? 'Таблица'}
            captionHidden
            rows={b.rows}
            rowKey={(r) => r.join('|')}
            columns={cols.map((c, i) => ({
              key: String(i),
              header: c,
              primary: i === 0,
              cell: (r: string[]) => (i === b.normCol && r[i] ? <NormLink code={r[i]} small /> : r[i]),
            }))}
          />
        </div>,
      );
    }

    case 'docs':
      return wrap(
        <div className="flex flex-col gap-4">
          {b.title ? <SectionHeading title={b.title} /> : null}
          <div className="grid-auto-wide grid gap-3">
            {b.items.map((it) => (
              <DocumentCard key={it.t} title={it.t} meta={`${it.m} · заглушка`} />
            ))}
          </div>
          {b.all ? (
            <div>
              <ButtonLink href="#" variant="secondary" aria-disabled="true">
                {b.all}
              </ButtonLink>
            </div>
          ) : null}
        </div>,
      );

    case 'norms':
      return wrap(
        <div className="flex flex-col gap-4">
          {b.title ? <SectionHeading title={b.title} /> : null}
          <ul className="m-0 flex list-none flex-col border-t border-border-strong p-0">
            {b.items.map(([t, c, d]) => (
              <li key={c} className="flex flex-col gap-2 border-b border-border-default py-3 md:flex-row md:items-center md:gap-6">
                <span className="md:w-1/3">
                  <NormLink code={`${t} ${c}`} />
                </span>
                <span className="type-body text-text-secondary">{d}</span>
              </li>
            ))}
          </ul>
        </div>,
      );

    case 'person':
      return wrap(
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <PersonCard name={b.n} role={b.r} note={b.x} />
          </div>
          <div className="flex flex-col gap-3 md:col-span-2">
            <SectionHeading title={b.title} />
            {b.phone ? (
              <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`} className="font-heading text-28 text-text-default no-underline nums">
                {b.phone}
              </a>
            ) : null}
            {b.email ? (
              <a href={`mailto:${b.email}`} className="type-body text-text-accent underline underline-offset-4">
                {b.email}
              </a>
            ) : null}
          </div>
        </div>,
      );

    case 'stats':
      return wrap(
        <div className="flex flex-col gap-6">
          {b.title ? <SectionHeading title={b.title} /> : null}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-wrap gap-8">
              {b.items.map((it, i) => (
                <FactFigure key={it.k} value={it.v} label={it.k} divider={i > 0} />
              ))}
            </div>
            {b.years ? <MiniChart years={b.years.map(([y, v]) => ({ year: String(y), value: v }))} /> : null}
          </div>
        </div>,
      );

    case 'map':
      return wrap(<ObjectsMapBlock filter={b.filter} items={b.items.map((o) => ({ ...o, href: o.r ? href(o.r) : undefined }))} />, 'karta', 'Карта объектов');

    case 'kv':
      return wrap(
        <div className="flex flex-col gap-4">
          {b.title ? <SectionHeading title={b.title} /> : null}
          <PassportTable items={b.items.map(([k, v]) => ({ key: k, value: v, copy: b.copy ? v : undefined }))} copyAll={b.copy ? b.items.map(([k, v]) => `${k}: ${v}`).join('\n') : undefined} />
          {b.link ? <ArrowLink href={href(b.link[1])}>{b.link[0]}</ArrowLink> : null}
        </div>,
      );

    case 'result':
      return wrap(
        <div className="flex flex-col gap-3 border-t border-b border-border-strong py-8">
          <p className="m-0 type-kicker text-text-accent">Результат</p>
          <p className="m-0 font-heading text-40 leading-heading">{b.v}</p>
          {b.d ? <p className="m-0 max-w-measure type-lead text-text-secondary">{b.d}</p> : null}
        </div>,
      );

    case 'logos':
      return wrap(
        <div className="flex flex-col gap-4">
          {b.title ? <SectionHeading title={b.title} /> : null}
          <div className="grid-auto-person grid gap-3">
            {Array.from({ length: b.n }, (_, i) => (
              <LogoCard key={i} name={`заказчика ${i + 1}`} />
            ))}
          </div>
        </div>,
      );

    case 'people':
      return wrap(
        <div className="flex flex-col gap-6">
          {b.title ? <SectionHeading title={b.title} /> : null}
          <div className={cn('grid gap-x-4 gap-y-8', b.lead ? 'grid-auto-card' : 'grid-auto-person')}>
            {b.items.map((p) => (
              <PersonCard key={p.n} name={p.n} role={p.r} note={[p.x, p.e].filter(Boolean).join(' · ')} />
            ))}
          </div>
        </div>,
      );

    case 'checks':
      return wrap(
        <ol className="m-0 flex list-none flex-col gap-8 p-0">
          {b.items.map((c, i) => (
            <li key={c.t} className="flex flex-col gap-3 border-t border-border-strong pt-6">
              <div className="flex items-baseline gap-4">
                <span className="font-heading text-40 leading-tight text-text-accent nums">{i + 1}</span>
                <h2 className="m-0 type-h3">{c.t}</h2>
              </div>
              {c.why ? <p className="m-0 type-body">{c.why}</p> : null}
              {c.how ? (
                <p className="m-0 type-body text-text-secondary">
                  <span className="type-kicker text-text-muted">Как проверить: </span>
                  {c.how}
                </p>
              ) : null}
              {c.bad ? <Callout kind="bad-sign">{c.bad}</Callout> : null}
              {c.ours ? (
                <p className="m-0 flex flex-wrap items-center gap-2 type-small">
                  <Tag tone="accent">Проверьте нас</Tag>
                  {c.ours}
                </p>
              ) : null}
            </li>
          ))}
        </ol>,
      );

    case 'callout':
      return wrap(
        <div className="grid gap-8 border-t border-border-strong pt-8 md:grid-cols-2">
          <SectionHeading title={b.t} sub={b.d} />
          {b.form ? <InlineForm kind={b.form} contacts={site.contacts} privacyHref={privacyHref} thanksHref={thanksHref} /> : null}
        </div>,
      );

    case 'article':
      return wrap(
        <article className="flex flex-col gap-6">
          {b.toc?.length ? (
            <nav aria-label="Содержание" className="border-t border-border-strong pt-4">
              <p className="m-0 mb-2 type-kicker text-text-muted">Содержание</p>
              <ol className="m-0 flex list-none flex-col gap-1 p-0">
                {b.toc.map((t) => (
                  <li key={t}>
                    <a href={`#${slug(t)}`} className="type-body text-text-accent underline underline-offset-4">
                      {t}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          {b.paras.map((p, i) => {
            if (p[0] === 'h')
              return (
                <h2 key={i} id={slug(p[1])} className="m-0 pt-4 type-h2">
                  {p[1]}
                </h2>
              );
            if (p[0] === 'p')
              return (
                <p key={i} className="m-0 type-lead text-justify hyphens-auto text-text-default">
                  {p[1]}
                </p>
              );
            if (p[0] === 'quote') return <NormQuote key={i} code={p[1]}>{p[2]}</NormQuote>;
            if (p[0] === 'callout')
              return (
                <Callout key={i} label={p[1]}>
                  {p[2]}
                </Callout>
              );
            return (
              <Table<string[]>
                key={i}
                caption="Таблица"
                captionHidden
                rows={p[2]}
                rowKey={(r) => r.join('|')}
                columns={p[1].map((c, j) => ({ key: String(j), header: c, primary: j === 0, align: j > 0 ? 'end' : 'start', cell: (r: string[]) => r[j] }))}
              />
            );
          })}
          {b.author ? (
            <p className="m-0 border-t border-border-default pt-4 type-small text-text-muted">
              Автор: <span className="text-text-default">{b.author.n}</span>, {b.author.r}
            </p>
          ) : null}
          {b.related ? (
            <div className="rounded-card border border-card-border p-card-padding">
              <p className="m-0 type-kicker text-text-muted">Связанная услуга</p>
              <ArrowLink href={href(b.related.r)}>{b.related.t}</ArrowLink>
            </div>
          ) : null}
        </article>,
      );

    case 'tz':
      return wrap(
        <div className="grid gap-8 border-t border-border-strong pt-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading title={b.title} sub={b.lead} />
            {b.items?.length ? (
              <ul className="m-0 flex list-none flex-col border-t border-border-default p-0">
                {b.items.map((it) => (
                  <li key={it} className="border-b border-border-default py-2 type-body">
                    {it}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <InlineForm kind="tz" title="Задача и файлы" contacts={site.contacts} privacyHref={privacyHref} thanksHref={thanksHref} />
        </div>,
        b.id ?? 'tz',
      );

    case 'contacts':
      return wrap(
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <a href={`tel:${site.contacts.phone.tel}`} className="font-heading text-40 leading-tight text-text-default no-underline nums">
              {site.contacts.phone.display}
            </a>
            <p className="m-0 type-body text-text-secondary">{site.contacts.hoursFull}</p>
            <a href={`mailto:${site.contacts.email}`} className="type-body text-text-accent underline underline-offset-4">
              {site.contacts.email}
            </a>
            <p className="m-0 type-body">{site.contacts.address}</p>
            <div className="flex flex-wrap gap-4">
              {site.contacts.messengers.map((m) => (
                <a key={m.href} href={m.href} className="type-body text-text-accent underline underline-offset-4">
                  {m.label}
                </a>
              ))}
            </div>
            <Plate label="карта проезда к офису" ratio="16/9" />
            <Plate label="фото входа в офис" ratio="16/9" />
          </div>
          <InlineForm kind="callback" title="Перезвоните мне" contacts={site.contacts} privacyHref={privacyHref} thanksHref={thanksHref} />
        </div>,
      );

    case 'error':
      return (
        <Container className="flex flex-col items-start gap-6 section-y">
          <FactFigure value="404" label="страница не найдена" />
          <h1 className="m-0 type-display">Такой страницы нет</h1>
          <Lead>Возможно, ссылка устарела. Начните с главной или посчитайте изыскания в калькуляторе.</Lead>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={href('home')}>На главную</ButtonLink>
            <ButtonLink href={href('raschet')} variant="secondary">
              Рассчитать стоимость
            </ButtonLink>
            <ButtonLink href={href('voprosy')} variant="secondary">
              Вопросы и ответы
            </ButtonLink>
          </div>
        </Container>
      );
  }
}


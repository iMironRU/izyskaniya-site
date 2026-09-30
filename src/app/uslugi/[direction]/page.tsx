import { existsSync } from 'node:fs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/Button/Button';
import { SampleCard, ServiceCard } from '@/components/Cards/Cards';
import { FaqAccordion } from '@/components/FaqAccordion/FaqAccordion';
import { PassportTable } from '@/components/PassportTable/PassportTable';
import { Plate } from '@/components/Plate/Plate';
import { PriceMatrix } from '@/components/PriceMatrix/PriceMatrix';
import { ArrowLink, Breadcrumbs, FactFigure, Kicker, Lead, NormLink, SectionHeading } from '@/components/Primitives/Primitives';
import { SectionChips } from '@/components/SectionChips/SectionChips';
import { Table } from '@/components/Table/Table';
import { Timeline } from '@/components/Timeline/Timeline';
import { formatNumber } from '@/lib/format';
import { loadSite } from '@/site/load';
import { computeMatrix, type MatrixConfig } from '@/site/matrix';
import { href } from '@/site/routes';
import { PageCta } from '@/site/ui/Cta';
import { FormButton } from '@/site/ui/Interactive';
import { Container, Section } from '@/site/ui/Layout';

// Шаблон страницы направления (design/handoff/pages/geologiya.md). Контент — data/site/<id>.yaml;
// если файла нет, страница собирается из data/site/directions.yaml (паспорт, услуги).
interface DirectionContent {
  h1: string;
  lead: string;
  passport: Array<{ key: string; value?: string; norm?: string }>;
  calc: string;
  objects: { title: string; items: Array<{ title: string; text: string; price: string }> };
  stages: { title: string; rows: Array<{ stage: string; what: string; norm: string }> };
  volume: { title: string; note: string; rows: Array<{ object: string; profile?: string; boreholes?: string; depth?: string; price?: string }> };
  timeline: { title: string; items: Array<{ term: string; title: string; text: string }> };
  samples: Array<{ type: string; title: string; meta: string }>;
  case: { kicker: string; title: string; text: string; facts: Array<{ value: string; label: string }> };
  faq: Array<{ q: string; a: string }>;
  related: Array<{ label: string; r: string }>;
}

const site = loadSite();
const pages = site.directions.filter((d) => d.page);

export const dynamicParams = false;
export function generateStaticParams() {
  return pages.map((d) => ({ direction: d.id }));
}

type Props = { params: Promise<{ direction: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { direction } = await params;
  const d = pages.find((x) => x.id === direction);
  return d ? { title: d.title, description: d.text } : {};
}

export default async function DirectionPage({ params }: Props) {
  const id = (await params).direction;
  const d = pages.find((x) => x.id === id);
  if (!d) notFound();
  const c = existsSync(`data/site/${id}.yaml`) ? site.content<DirectionContent>(id) : null;
  const ceny = site.content<{ geology_matrix: MatrixConfig }>('ceny');
  const matrix = id === 'geologiya' ? computeMatrix(site.calc, ceny.geology_matrix, { rows: 4, cols: 3 }) : null;
  const crumbs = [{ label: 'Главная', href: href('home') }, { label: 'Услуги', href: href('uslugi') }, { label: d.short }];
  const forms = { contacts: site.contacts, privacyHref: href('privacy'), thanksHref: href('spasibo') };
  const chips = c
    ? [
        { id: 'obekty', label: 'Объекты' },
        { id: 'sostav', label: 'Что входит' },
        { id: 'obem', label: 'Объём' },
        { id: 'sroki', label: 'Сроки' },
        ...(matrix ? [{ id: 'ceny', label: 'Цены' }] : []),
        { id: 'obrazcy', label: 'Образцы' },
        { id: 'keys', label: 'Кейс' },
        { id: 'voprosy', label: 'Вопросы' },
      ]
    : [];

  return (
    <>
      <Container className="flex flex-col gap-6 pt-8">
        <Breadcrumbs items={crumbs} />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h1 className="m-0 type-display">{c?.h1 ?? d.title}</h1>
            <Lead>{c?.lead ?? d.text}</Lead>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={href(c?.calc ?? 'raschet')}>Рассчитать</ButtonLink>
              <FormButton label="Отправить ТЗ" kind="tz" {...forms} />
            </div>
          </div>
          <PassportTable
            items={(c?.passport ?? [
              { key: 'Цена', value: d.from },
              { key: 'Срок', value: d.days },
            ]).map((p) => ({ key: p.key, value: p.norm ? <NormLink code={p.norm} /> : p.value }))}
          />
        </div>
        {chips.length ? (
          <div className="border-t border-border-default pt-4">
            <SectionChips sections={chips} />
          </div>
        ) : null}
      </Container>

      {c ? (
        <>
          <Section id="obekty">
            <Container className="flex flex-col gap-6">
              <SectionHeading title={c.objects.title} />
              <div className="grid-auto-card grid gap-3">
                {c.objects.items.map((o) => (
                  <ServiceCard key={o.title} href={href(c.calc)} title={o.title} text={o.text} from={o.price} />
                ))}
              </div>
            </Container>
          </Section>

          <Section id="sostav">
            <Container className="flex flex-col gap-6">
              <SectionHeading title={c.stages.title} />
              <Table
                caption={c.stages.title}
                captionHidden
                rows={c.stages.rows.map((r, i) => ({ ...r, n: i + 1 }))}
                rowKey={(r) => r.stage}
                columns={[
                  { key: 'n', header: '№', cell: (r) => r.n },
                  { key: 'stage', header: 'Этап', cell: (r) => r.stage, primary: true },
                  { key: 'what', header: 'Что делаем', cell: (r) => r.what },
                  { key: 'norm', header: 'Норматив', cell: (r) => <NormLink code={r.norm} small /> },
                ]}
              />
            </Container>
          </Section>

          <Section id="obem">
            <Container className="flex flex-col gap-6">
              <SectionHeading title={c.volume.title} />
              <Table
                caption={c.volume.title}
                captionHidden
                rows={c.volume.rows.map((r) => {
                  if (!r.profile) return { object: r.object, bh: r.boreholes ?? '—', depth: r.depth ?? '—', price: r.price ?? '—' };
                  const p = site.program(r.profile);
                  const q = (x: string) => p.quantities.find((v) => v.id === x)?.value;
                  return { object: r.object, bh: formatNumber(q('boreholes') ?? 0), depth: `${formatNumber(q('depth_m') ?? 0)} м`, price: site.price(r.profile) };
                })}
                rowKey={(r) => r.object}
                columns={[
                  { key: 'object', header: 'Объект', cell: (r) => r.object, primary: true },
                  { key: 'bh', header: 'Скважин', cell: (r) => r.bh, align: 'end' },
                  { key: 'depth', header: 'Глубина', cell: (r) => r.depth, align: 'end' },
                  { key: 'price', header: 'Цена от', cell: (r) => r.price, align: 'end' },
                ]}
              />
              <p className="m-0 max-w-measure type-small text-text-muted">{c.volume.note}</p>
            </Container>
          </Section>

          <Section id="sroki">
            <Container className="flex flex-col gap-6">
              <SectionHeading title={c.timeline.title} />
              <Timeline items={c.timeline.items} />
            </Container>
          </Section>

          {matrix ? (
            <Section id="ceny">
              <Container className="flex flex-col gap-6">
                <SectionHeading title="Цены под частный дом" link={{ label: 'Все цены', href: href('ceny') }} />
                <PriceMatrix name="geo-fragment" caption={ceny.geology_matrix.title} rowAxis={ceny.geology_matrix.row_axis} rows={matrix.rows} cols={matrix.cols} cells={matrix.cells} />
              </Container>
            </Section>
          ) : null}

          <Section id="obrazcy">
            <Container className="flex flex-col gap-6">
              <SectionHeading title="Что вы получите" link={{ label: 'Все образцы', href: href('obrazcy') }} />
              <div className="grid-auto-sample grid gap-4">
                {c.samples.map((s) => (
                  <SampleCard key={s.title} type={s.type} title={s.title} meta={s.meta} href={href('obrazcy')} />
                ))}
              </div>
            </Container>
          </Section>

          <Section id="keys">
            <Container className="grid gap-8 md:grid-cols-2">
              <Plate label="буровая на участке" ratio="4/3" />
              <div className="flex flex-col gap-4">
                <Kicker>{c.case.kicker}</Kicker>
                <h2 className="m-0 type-h2">{c.case.title}</h2>
                <p className="m-0 type-body text-text-secondary">{c.case.text}</p>
                <div className="flex flex-wrap gap-8">
                  {c.case.facts.map((f, i) => (
                    <FactFigure key={f.label} value={f.value} label={f.label} divider={i > 0} />
                  ))}
                </div>
                <ArrowLink href={href('obekty')}>Все объекты</ArrowLink>
              </div>
            </Container>
          </Section>
        </>
      ) : null}

      <Section id="uslugi">
        <Container className="flex flex-col gap-6">
          <SectionHeading title="Услуги направления" />
          <div className="grid-auto-card grid gap-3">
            {d.services.map((s) => (
              <ServiceCard key={s.title} href={href(s.r)} title={s.title} from={s.price ? site.price(s.price) : 'по ТЗ'} />
            ))}
          </div>
        </Container>
      </Section>

      {c ? (
        <>
          <Section id="voprosy">
            <Container className="grid gap-8 md:grid-cols-3">
              <SectionHeading title={`Вопросы о направлении`} />
              <div className="md:col-span-2">
                <FaqAccordion items={c.faq} />
              </div>
            </Container>
          </Section>
          <Section>
            <Container className="flex flex-col gap-4">
              <SectionHeading title="Часто нужно вместе" as="h3" />
              <div className="flex flex-wrap gap-3">
                {c.related.map((r) => (
                  <ButtonLink key={r.label} href={href(r.r)} variant="secondary">
                    {r.label}
                  </ButtonLink>
                ))}
              </div>
            </Container>
          </Section>
        </>
      ) : null}

      <PageCta site={site} />
    </>
  );
}

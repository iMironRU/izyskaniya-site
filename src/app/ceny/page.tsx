import type { Metadata } from 'next';
import { Check, Minus } from 'lucide-react';
import { ButtonLink } from '@/components/Button/Button';
import { FaqAccordion } from '@/components/FaqAccordion/FaqAccordion';
import { PriceMatrix } from '@/components/PriceMatrix/PriceMatrix';
import { ArrowLink, Breadcrumbs, Lead, SectionHeading, Tag } from '@/components/Primitives/Primitives';
import { SectionChips } from '@/components/SectionChips/SectionChips';
import { Table } from '@/components/Table/Table';
import { formatMoney } from '@/lib/format';
import { loadSite } from '@/site/load';
import { computeMatrix, type MatrixConfig } from '@/site/matrix';
import { href } from '@/site/routes';
import { PageCta } from '@/site/ui/Cta';
import { FormButton } from '@/site/ui/Interactive';
import { Container, Section } from '@/site/ui/Layout';

export const metadata: Metadata = { title: 'Цены', description: 'Цены на инженерные изыскания: геология, топосъёмка, другие направления. Считаются той же моделью, что калькулятор.' };

interface Ceny {
  title: string;
  lead: string;
  calc_lead: string;
  geology_matrix: MatrixConfig;
  topo: { title: string; rows: Array<{ what: string; scale: string; price: string; days: string }> };
  other: { title: string; items: string[] };
  commercial: { title: string; lead: string; rows: Array<{ object: string; volume: string; price: string }> };
  included: { in: string[]; out: string[] };
  discounts: Array<{ title: string; value: string }>;
  payment: string;
  faq: Array<{ q: string; a: string }>;
}

/** Цены (design/handoff/pages/ceny.md). Все цифры — из data/pricing.yaml через движок. */
export default function CenyPage() {
  const site = loadSite();
  const c = site.content<Ceny>('ceny');
  const m = computeMatrix(site.calc, c.geology_matrix);
  const zones = site.calc.pricing.travel_zones;
  const forms = { contacts: site.contacts, privacyHref: href('privacy'), thanksHref: href('spasibo') };

  return (
    <>
      <Container className="flex flex-col gap-6 pt-8">
        <Breadcrumbs items={[{ label: 'Главная', href: href('home') }, { label: c.title }]} />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h1 className="m-0 type-display">{c.title}</h1>
            <Lead>{c.lead}</Lead>
          </div>
          <div className="flex flex-col items-start gap-4 border-t border-border-strong pt-4">
            <p className="m-0 type-body">{c.calc_lead}</p>
            <ButtonLink href={href('raschet')}>Рассчитать стоимость</ButtonLink>
          </div>
        </div>
        <div className="border-t border-border-default pt-4">
          <SectionChips
            sections={[
              { id: 'geologiya', label: 'Геология' },
              { id: 'topografiya', label: 'Топография' },
              { id: 'drugie', label: 'Другие' },
              { id: 'kommercheskie', label: 'Коммерческие' },
              { id: 'vhodit', label: 'Что входит' },
              { id: 'voprosy', label: 'Вопросы' },
            ]}
          />
        </div>
      </Container>

      <Section id="geologiya">
        <Container>
          <PriceMatrix name="geo" caption={c.geology_matrix.title} sub={c.geology_matrix.sub} rowAxis={c.geology_matrix.row_axis} rows={m.rows} cols={m.cols} cells={m.cells} />
        </Container>
      </Section>

      <Section id="topografiya">
        <Container className="flex flex-col gap-4">
          <SectionHeading title={c.topo.title} />
          <Table
            caption={c.topo.title}
            captionHidden
            rows={c.topo.rows}
            rowKey={(r) => r.what}
            columns={[
              { key: 'what', header: 'Вид работ', cell: (r) => r.what, primary: true },
              { key: 'scale', header: 'Масштаб', cell: (r) => r.scale },
              { key: 'price', header: 'Цена', cell: (r) => r.price, align: 'end' },
              { key: 'days', header: 'Срок', cell: (r) => r.days, align: 'end' },
            ]}
          />
        </Container>
      </Section>

      <Section id="drugie">
        <Container className="flex flex-col gap-4">
          <SectionHeading title={c.other.title} />
          <dl className="m-0 grid-auto-card grid gap-x-6 border-t border-border-strong">
            {c.other.items.map((id) => {
              const d = site.directions.find((x) => x.id === id)!;
              return (
                <div key={id} className="flex items-baseline justify-between gap-3 border-b border-border-default py-3">
                  <dt className="type-body">{d.title}</dt>
                  <dd className="m-0 font-heading text-20 nums">{d.from}</dd>
                </div>
              );
            })}
          </dl>
        </Container>
      </Section>

      <Section id="kommercheskie">
        <Container className="flex flex-col gap-4">
          <SectionHeading title={c.commercial.title} sub={c.commercial.lead} />
          <Table
            caption={c.commercial.title}
            captionHidden
            rows={c.commercial.rows}
            rowKey={(r) => r.object}
            columns={[
              { key: 'object', header: 'Объект', cell: (r) => r.object, primary: true },
              { key: 'volume', header: 'Типовой объём', cell: (r) => r.volume },
              { key: 'price', header: 'Цена от', cell: (r) => r.price, align: 'end' },
            ]}
          />
          <div>
            <FormButton label="Отправить ТЗ на расчёт" kind="tz" {...forms} />
          </div>
        </Container>
      </Section>

      <Section id="vhodit">
        <Container className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <h2 className="m-0 type-h3">Входит в цену</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {c.included.in.map((x) => (
                <li key={x} className="flex gap-2 type-body">
                  <Check className="mt-1 size-16 shrink-0 text-accent-default" strokeWidth={1.5} aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="m-0 type-h3">Оплачивается отдельно</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {c.included.out.map((x) => (
                <li key={x} className="flex gap-2 type-body text-text-secondary">
                  <Minus className="mt-1 size-16 shrink-0 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
            <dl className="m-0 border-t border-border-default">
              {zones.map((z) => (
                <div key={z.id} className="flex justify-between gap-3 border-b border-border-default py-1 type-small nums">
                  <dt className="text-text-muted">Выезд {z.title}</dt>
                  <dd className="m-0">{z.price === null ? 'по согласованию' : z.price === 0 ? 'бесплатно' : formatMoney(z.price)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="m-0 type-h3">Скидки и оплата</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {c.discounts.map((d) => (
                <li key={d.title} className="flex items-center justify-between gap-3 type-body">
                  {d.title}
                  <Tag tone="accent">{d.value}</Tag>
                </li>
              ))}
            </ul>
            <p className="m-0 type-small text-text-secondary">{c.payment}</p>
            <ArrowLink href={href('kak-rabotaem')}>Подробнее в разделе «Как мы работаем»</ArrowLink>
          </div>
        </Container>
      </Section>

      <Section id="voprosy">
        <Container className="grid gap-8 md:grid-cols-3">
          <SectionHeading title="Вопросы о ценах" />
          <div className="md:col-span-2">
            <FaqAccordion items={c.faq} />
          </div>
        </Container>
      </Section>

      <PageCta site={site} />
    </>
  );
}

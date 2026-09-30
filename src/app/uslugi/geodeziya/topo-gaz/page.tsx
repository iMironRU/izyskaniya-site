import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Button/Button';
import { FaqAccordion } from '@/components/FaqAccordion/FaqAccordion';
import { PassportTable } from '@/components/PassportTable/PassportTable';
import { Plate } from '@/components/Plate/Plate';
import { ArrowLink, Breadcrumbs, FactFigure, Kicker, Lead, NormLink, SectionHeading } from '@/components/Primitives/Primitives';
import { Table } from '@/components/Table/Table';
import { Timeline } from '@/components/Timeline/Timeline';
import { loadSite } from '@/site/load';
import { href } from '@/site/routes';
import { PageCta } from '@/site/ui/Cta';
import { Container, Section } from '@/site/ui/Layout';

// Шаблон страницы услуги (design/handoff/pages/topo-gaz.md). Контент — data/site/topo-gaz.yaml.
interface ServiceContent {
  direction: string;
  crumb: string;
  h1: string;
  lead: string;
  price: string;
  days: string;
  norm: string;
  calc: string;
  when: string[];
  result: Array<{ key: string; value: string }>;
  need: Array<{ title: string; text: string }>;
  prices: Array<{ what: string; price: string; note: string }>;
  travel: string;
  timeline: Array<{ term: string; title: string; text: string }>;
  sample: { title: string; text: string };
  faq: Array<{ q: string; a: string }>;
  related: Array<{ label: string; r: string }>;
  factors: { title: string; rows: Array<{ factor: string; effect: string }> };
}

const site = loadSite();
const s = site.content<ServiceContent>('topo-gaz');
const dir = site.directions.find((d) => d.id === s.direction)!;

export const metadata: Metadata = { title: s.h1, description: s.lead };

export default function ServicePage() {
  return (
    <>
      <Container className="flex flex-col gap-6 pt-8">
        <Breadcrumbs items={[{ label: 'Главная', href: href('home') }, { label: 'Услуги', href: href('uslugi') }, { label: dir.short, href: dir.href }, { label: s.crumb }]} />
        <h1 className="m-0 max-w-measure type-display">{s.h1}</h1>
        <Lead>{s.lead}</Lead>
        <div className="flex flex-wrap items-end gap-8 border-t border-border-strong pt-4">
          <FactFigure value={s.price} label="цена" />
          <FactFigure value={s.days} label="срок" divider />
          <div className="flex flex-col gap-1 border-l border-border-default pl-4">
            <NormLink code={s.norm} />
            <span className="type-small text-text-muted">норматив</span>
          </div>
        </div>
        <div>
          <ButtonLink href={href(s.calc)}>Рассчитать топосъёмку</ButtonLink>
        </div>
      </Container>

      <Section>
        <Container className="grid gap-8 md:grid-cols-2">
          <SectionHeading title="Когда это нужно" />
          <ol className="m-0 flex list-none flex-col border-t border-border-strong p-0">
            {s.when.map((w, i) => (
              <li key={w} className="flex gap-4 border-b border-border-default py-3 type-body">
                <span className="font-heading text-18 text-text-accent nums">{i + 1}</span>
                {w}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading title="Что вы получите" />
            <PassportTable items={s.result} />
          </div>
          <div className="flex flex-col gap-4">
            <SectionHeading title="Что нужно от вас" />
            <ul className="m-0 flex list-none flex-col border-t border-border-strong p-0">
              {s.need.map((n) => (
                <li key={n.title} className="flex flex-col gap-1 border-b border-border-default py-3">
                  <span className="type-body">{n.title}</span>
                  <span className="type-small text-text-muted">{n.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-4">
          <SectionHeading title="Цена" />
          <Table
            caption="Цена"
            captionHidden
            rows={s.prices}
            rowKey={(r) => r.what}
            columns={[
              { key: 'what', header: 'Вариант', cell: (r) => r.what, primary: true },
              { key: 'note', header: 'Почему', cell: (r) => r.note },
              { key: 'price', header: 'Цена', cell: (r) => r.price, align: 'end' },
            ]}
          />
          <p className="m-0 type-small text-text-muted">{s.travel}</p>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-4">
          <SectionHeading title={s.factors.title} />
          <Table
            caption={s.factors.title}
            captionHidden
            rows={s.factors.rows}
            rowKey={(r) => r.factor}
            collapseAfter={s.factors.rows.length}
            columns={[
              { key: 'factor', header: 'Фактор', cell: (r) => r.factor, primary: true },
              { key: 'effect', header: 'Как влияет на цену и срок', cell: (r) => r.effect },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-6">
          <SectionHeading title="Этапы и сроки" />
          <Timeline items={s.timeline} />
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 md:grid-cols-2">
          <Plate label="фрагмент топоплана" ratio="4/3" />
          <div className="flex flex-col gap-3">
            <Kicker>Образец результата</Kicker>
            <h2 className="m-0 type-h2">{s.sample.title}</h2>
            <p className="m-0 type-body text-text-secondary">{s.sample.text}</p>
            <ArrowLink href={href('obrazcy')}>Все образцы</ArrowLink>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 md:grid-cols-3">
          <SectionHeading title="Вопросы" />
          <div className="md:col-span-2">
            <FaqAccordion items={s.faq} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-4">
          <p className="m-0 type-kicker text-text-muted">Направление</p>
          <ArrowLink href={dir.href}>{dir.title}</ArrowLink>
          <div className="flex flex-wrap gap-3">
            {s.related.map((r) => (
              <ButtonLink key={r.label} href={href(r.r)} variant="secondary">
                {r.label}
              </ButtonLink>
            ))}
          </div>
        </Container>
      </Section>

      <PageCta site={site} />
    </>
  );
}

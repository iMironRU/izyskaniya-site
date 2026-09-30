import { BoreholeColumn, type SoilLayer } from '@/components/Borehole/BoreholeColumn';
import { CaseCard, DirectionCard, PersonCard, SampleCard, ScenarioRow } from '@/components/Cards/Cards';
import { FaqAccordion } from '@/components/FaqAccordion/FaqAccordion';
import { MiniChart } from '@/components/MiniChart/MiniChart';
import { ArrowLink, FactFigure, Kicker, Lead, SectionHeading } from '@/components/Primitives/Primitives';
import { Timeline } from '@/components/Timeline/Timeline';
import { TrustStrip } from '@/components/TrustStrip/TrustStrip';
import { loadSite } from '@/site/load';
import { href } from '@/site/routes';
import { PageCta } from '@/site/ui/Cta';
import { ObjectsMapBlock } from '@/site/ui/Interactive';
import { Container, Section } from '@/site/ui/Layout';
import type { MapBlock, StatsBlock } from '@/site/blocks';

interface Home {
  kicker: string;
  h1: string;
  lead: string;
  scenarios: Array<{ title: string; text: string; r: string; price: string }>;
  borehole: { title: string; elevation: string; water: number; layers: SoilLayer[] };
  how: { title: string; items: Array<{ title: string; term: string; text: string }> };
  samples: { title: string; sub: string; items: Array<{ type: string; title: string; meta: string }> };
  objects: { title: string; facts: Array<{ value: string; label: string }> };
  people: { title: string; items: Array<{ name: string; role: string; note: string }> };
  checks: { title: string; lead: string; items: Array<{ title: string; note: string; link: { label: string; href: string } }> };
  faq: { title: string; items: Array<{ q: string; a: string }> };
}

/** Главная (design/handoff/pages/home.md). */
export default function HomePage() {
  const site = loadSite();
  const h = site.content<Home>('home');
  const c = site.company;
  // Карта, цифры и кейсы — из страницы «Объекты», чтобы не дублировать данные.
  const obekty = site.page('obekty');
  const stats = obekty.blocks.find((b): b is StatsBlock => b.type === 'stats');
  const map = obekty.blocks.find((b): b is MapBlock => b.type === 'map');

  return (
    <>
      <Container className="grid gap-8 pt-8 pb-4 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Kicker>{h.kicker}</Kicker>
          <h1 className="m-0 type-display">{h.h1}</h1>
          <Lead>{h.lead}</Lead>
          <ol className="m-0 list-none border-t border-border-strong p-0">
            {h.scenarios.map((s, i) => (
              <ScenarioRow key={s.title} n={i + 1} href={href(s.r)} title={s.title} text={s.text} price={s.price} />
            ))}
          </ol>
        </div>
        <div className="hidden lg:block">
          <BoreholeColumn title={h.borehole.title} elevation={h.borehole.elevation} water={h.borehole.water} layers={h.borehole.layers} />
        </div>
      </Container>

      <Container className="pt-6">
        <TrustStrip
          items={[
            { label: 'СРО', value: c.sro.number },
            { label: 'Лаборатория', value: c.lab.accreditation },
            { label: 'Работаем', value: `с ${c.founded} года` },
            { label: 'Объектов', value: h.objects.facts[0]?.value ?? '—' },
            { label: c.rating.source, value: `${c.rating.value} · ${c.rating.count}` },
          ]}
        />
      </Container>

      <Section label="Направления">
        <Container className="flex flex-col gap-6">
          <SectionHeading title="Направления" link={{ label: 'Все услуги', href: href('uslugi') }} />
          <div className="grid-auto-card grid gap-3">
            {site.directions.map((d) => (
              <DirectionCard key={d.id} href={d.href} title={d.title} text={d.text} from={d.from} days={d.days} />
            ))}
          </div>
        </Container>
      </Section>

      <Section label={h.how.title}>
        <Container className="flex flex-col gap-6">
          <SectionHeading title={h.how.title} />
          <Timeline rule="strong" items={h.how.items} />
        </Container>
      </Section>

      <Section label={h.samples.title}>
        <Container className="flex flex-col gap-6">
          <SectionHeading title={h.samples.title} sub={h.samples.sub} link={{ label: 'Все образцы', href: href('obrazcy') }} />
          <div className="grid-auto-sample grid gap-4">
            {h.samples.items.map((s) => (
              <SampleCard key={s.title} type={s.type} title={s.title} meta={s.meta} href={href('obrazcy')} />
            ))}
          </div>
        </Container>
      </Section>

      <Section label={h.objects.title}>
        <Container className="flex flex-col gap-6">
          <SectionHeading title={h.objects.title} link={{ label: 'Карта объектов', href: href('obekty') }} />
          <div className="grid gap-8 md:grid-cols-2">
            {map ? <ObjectsMapBlock mapOnly items={map.items.map((o) => ({ ...o, href: o.r ? href(o.r) : undefined }))} /> : null}
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-8">
                {h.objects.facts.map((f, i) => (
                  <FactFigure key={f.label} value={f.value} label={f.label} divider={i > 0} />
                ))}
              </div>
              {stats?.years ? <MiniChart years={stats.years.map(([y, v]) => ({ year: String(y), value: v }))} /> : null}
            </div>
          </div>
          {map ? (
            <div className="grid-auto-wide grid gap-3">
              {map.items
                .filter((o) => o.fig)
                .slice(0, 3)
                .map((o) => (
                  <CaseCard key={o.t} href={o.r ? href(o.r) : undefined} kicker={o.kicker} title={o.t} text={o.d} figure={o.fig ?? ''} />
                ))}
            </div>
          ) : null}
        </Container>
      </Section>

      <Section label={h.people.title}>
        <Container className="flex flex-col gap-6">
          <SectionHeading title={h.people.title} link={{ label: 'Вся команда', href: href('komanda') }} />
          <div className="grid-auto-person grid gap-x-4 gap-y-8">
            {h.people.items.map((p) => (
              <PersonCard key={p.name} name={p.name} role={p.role} note={p.note} />
            ))}
          </div>
        </Container>
      </Section>

      <Section label={h.checks.title}>
        <Container className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <SectionHeading title={h.checks.title} sub={h.checks.lead} />
            <ArrowLink href={href('proverka')}>Как проверить любого подрядчика</ArrowLink>
          </div>
          <ol className="m-0 flex list-none flex-col border-t border-border-strong p-0">
            {h.checks.items.map((it, i) => (
              <li key={it.title} className="flex gap-4 border-b border-border-default py-3">
                <span className="w-4 shrink-0 font-heading text-16 text-text-accent nums">{i + 1}</span>
                <span className="flex flex-1 flex-col gap-1">
                  <span className="type-body">{it.title}</span>
                  <span className="type-small text-text-muted nums">{it.note}</span>
                </span>
                <a href={href(it.link.href)} className="shrink-0 type-small text-text-accent underline underline-offset-4">
                  {it.link.label}
                </a>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section label={h.faq.title}>
        <Container className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <SectionHeading title={h.faq.title} />
            <ArrowLink href={href('voprosy')}>Все вопросы и ответы</ArrowLink>
          </div>
          <FaqAccordion items={h.faq.items} />
        </Container>
      </Section>

      <PageCta site={site} />
    </>
  );
}


import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Button/Button';
import { Breadcrumbs, Lead, SectionHeading } from '@/components/Primitives/Primitives';
import { loadSite } from '@/site/load';
import { href } from '@/site/routes';
import { PageCta } from '@/site/ui/Cta';
import { FormButton } from '@/site/ui/Interactive';
import { Container, Section } from '@/site/ui/Layout';
import { Directions } from './Directions';

export const metadata: Metadata = { title: 'Услуги' };

interface Uslugi {
  title: string;
  lead: string;
  tasks: Array<{ value: string; label: string }>;
  notfound: { title: string; lead: string };
}

/** Услуги (design/handoff/pages/uslugi.md). */
export default function UslugiPage() {
  const site = loadSite();
  const u = site.content<Uslugi>('uslugi');
  const items = site.directions.map((d) => ({
    id: d.id,
    title: d.title,
    text: d.text,
    from: d.from,
    days: d.days,
    href: d.page ? d.href : href('raschet'),
    tasks: d.tasks,
    services: d.services.map((s) => ({ label: s.title, href: href(s.r), price: s.price ? site.price(s.price) : undefined })),
  }));
  return (
    <>
      <Container className="flex flex-col gap-6 pt-8">
        <Breadcrumbs items={[{ label: 'Главная', href: href('home') }, { label: u.title }]} />
        <h1 className="m-0 type-display">{u.title}</h1>
        <Lead>{u.lead}</Lead>
      </Container>
      <Section>
        <Container>
          <Directions items={items} tasks={u.tasks} />
        </Container>
      </Section>
      <Section>
        <Container className="flex flex-col gap-4 border-t border-border-strong pt-8">
          <SectionHeading title={u.notfound.title} sub={u.notfound.lead} />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={href('raschet')}>Рассчитать стоимость</ButtonLink>
            <FormButton label="Отправить ТЗ" kind="tz" contacts={site.contacts} privacyHref={href('privacy')} thanksHref={href('spasibo')} />
          </div>
        </Container>
      </Section>
      <PageCta site={site} />
    </>
  );
}

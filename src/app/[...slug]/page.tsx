import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSite } from '@/site/load';
import { ROUTES } from '@/site/routes';
import { PageBlocks } from '@/site/ui/Blocks';
import { PageCta } from '@/site/ui/Cta';

// Блочные страницы: адрес из src/site/routes.ts, контент из data/site/pages/<ключ>.yaml.
const site = loadSite();
const byPath = Object.fromEntries(
  Object.entries(ROUTES)
    .filter(([key]) => site.pageKeys.includes(key))
    .map(([key, path]) => [path.replace(/^\/|\/$/g, ''), key]),
);

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(byPath).map((p) => ({ slug: p.split('/') }));
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = byPath[(await params).slug.join('/')];
  return key ? { title: site.page(key).title } : {};
}

export default async function BlockPage({ params }: Props) {
  const key = byPath[(await params).slug.join('/')];
  if (!key) notFound();
  const page = site.page(key);
  return (
    <>
      <PageBlocks page={page} site={site} />
      {page.noCta ? null : <PageCta site={site} />}
    </>
  );
}

import { FinalCta } from '@/components/Footer/Footer';
import type { Site } from '../load';
import { href } from '../routes';

/** Финальный CTA страниц (footer.md: prop cta). ТЗ — через раздел «Проектировщикам», там форма с файлом. */
export function PageCta({ site }: { site: Site }) {
  return <FinalCta calcHref={href('raschet')} tzHref={href('proektirovshchikam')} phone={site.contacts.phone} hours={site.contacts.hours} />;
}

import { loadSite } from '@/site/load';
import { PageBlocks } from '@/site/ui/Blocks';

export default function NotFound() {
  const site = loadSite();
  return <PageBlocks page={site.page('404')} site={site} />;
}

// Рендерит образец PDF в файл — посмотреть макет без браузера.
//   npm run pdf:sample -- out.pdf
import { renderToFile } from '@react-pdf/renderer';
import { resolve } from 'node:path';
import { ProgramPdf, registerFonts } from '../src/components/Calculator/pdf';
import { calculate } from '../src/engine/calculate';
import { loadCalcData } from '../src/engine/load';
import { UNKNOWN } from '../src/engine/schema';
import { loadCompany } from '../src/site/load';

const out = process.argv[2] ?? 'sample.pdf';
const data = loadCalcData();
const company = loadCompany();
const program = calculate(data, {
  services: ['geology', 'topo'],
  object_type: 'house',
  distance_km: 40,
  urgency: 'normal',
  length_m: 12,
  floors: '2',
  basement: false,
  foundation: UNKNOWN,
  topo_purpose: 'gas',
  topo_geometry: 'area',
  area_ha: 0.12,
  scale: '500',
  utilities: true,
  trees: false,
  stakeout: false,
  approvals: true,
});

registerFonts(resolve('public'));
await renderToFile(<ProgramPdf data={data} program={program} company={company} shareUrl="https://example.com/calculator/?r=…" date={new Date()} />, out);
console.log(`PDF: ${out}`);

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
  ...data.presets!.dom.answers,
  object_type: 'house',
  floors: UNKNOWN,
  dims: '12×9',
  foundation: UNKNOWN,
  distance_km: 40,
  cadastral: '66:41:0206014:37',
  need_topo: true,
});

registerFonts(resolve('public'));
await renderToFile(<ProgramPdf data={data} program={program} company={company} shareUrl="https://example.com/raschet/?r=…" date={new Date()} number="П-0412" />, out);
console.log(`PDF: ${out}`);

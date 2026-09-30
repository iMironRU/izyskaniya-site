// Полные woff-шрифты для PDF (react-pdf не умеет woff2 и разбивку по unicode-range).
// Копируются из npm в public/fonts/pdf/ перед dev/build/storybook. В git не попадают.
import { copyFileSync, mkdirSync } from 'node:fs';

const OUT = 'public/fonts/pdf';
const FILES = [
  '@ibm/plex-sans/fonts/complete/woff/IBMPlexSans-Regular.woff',
  '@ibm/plex-sans/fonts/complete/woff/IBMPlexSans-SemiBold.woff',
  '@ibm/plex-sans/fonts/complete/woff/IBMPlexSans-Bold.woff',
  '@ibm/plex-mono/fonts/complete/woff/IBMPlexMono-Regular.woff',
];

mkdirSync(OUT, { recursive: true });
for (const f of FILES) copyFileSync(`node_modules/${f}`, `${OUT}/${f.split('/').pop()}`);
console.log(`PDF-шрифты: ${FILES.length} файла → ${OUT}`);

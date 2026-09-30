// Цельные TTF для PDF (react-pdf не умеет woff2 и разбивку по unicode-range).
// Собираются scripts/build-pdf-fonts.py в assets/pdf-fonts/, отсюда копируются в public/fonts/pdf/.
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';

const SRC = 'assets/pdf-fonts';
const OUT = 'public/fonts/pdf';
mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC).filter((f) => f.endsWith('.ttf'));
for (const f of files) copyFileSync(`${SRC}/${f}`, `${OUT}/${f}`);
console.log(`PDF-шрифты: ${files.length} файлов → ${OUT}`);

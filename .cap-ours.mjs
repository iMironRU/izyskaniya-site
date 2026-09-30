import { chromium } from '@playwright/test';
const ROUTES = [['home', '/'], ['uslugi', '/uslugi/'], ['geologiya', '/uslugi/geologiya/'], ['topo-gaz', '/uslugi/geodeziya/topo-gaz/'], ['ceny', '/ceny/'], ['raschet', '/raschet/?s=dom'], ['chastnym', '/chastnym/'], ['proektirovshchikam', '/proektirovshchikam/'], ['obrazcy', '/obrazcy/'], ['obekty', '/obekty/'], ['keys', '/obekty/dom-na-sklone/'], ['o-kompanii', '/o-kompanii/'], ['komanda', '/o-kompanii/komanda/'], ['laboratoriya', '/o-kompanii/laboratoriya/'], ['tehnika', '/o-kompanii/tehnika/'], ['dokumenty', '/o-kompanii/dokumenty/'], ['kak-rabotaem', '/kak-rabotaem/'], ['proverka', '/proverka-podryadchika/'], ['voprosy', '/voprosy/'], ['stati', '/stati/'], ['statya', '/stati/geologiya-dlya-doma/'], ['kontakty', '/kontakty/'], ['spasibo', '/spasibo/'], ['privacy', '/privacy/'], ['404', '/nope/']];
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
const b = await chromium.launch();
for (const [dir, w, h] of [['desktop-1280', 1280, 820], ['mobile-390', 390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  for (const [k, path] of ROUTES) {
    if (only && !only.includes(k)) continue;
    await p.goto('http://127.0.0.1:8080' + path, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `.ref/ours/${dir}/${k}.png`, fullPage: true });
  }
  await p.close();
}
await b.close();
console.log('done');

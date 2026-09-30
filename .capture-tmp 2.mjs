// Снимки всех страниц на 1280 и 390, во всю высоту. Та же основа годится для визуальной регрессии.
// Запуск из папки prototype/:  npx http-server -p 8080 .  затем  node ../screenshots/capture.mjs
import { chromium } from '@playwright/test';
const BASE = process.env.BASE || 'http://localhost:8080/';
const ROUTES = [["404","Страница.dc.html?p=404"],["home","Страница - Главная.dc.html"],["uslugi","Страница - Услуги.dc.html"],["geologiya","Страница - Направление.dc.html"],["topo-gaz","Страница - Услуга.dc.html"],["ceny","Страница - Цены.dc.html"],["raschet","Прототип - Частный дом.dc.html"],["chastnym","Страница.dc.html?p=chastnym"],["proektirovshchikam","Страница.dc.html?p=proektirovshchikam"],["obrazcy","Страница.dc.html?p=obrazcy"],["obekty","Страница.dc.html?p=obekty"],["keys","Страница.dc.html?p=keys"],["o-kompanii","Страница.dc.html?p=o-kompanii"],["komanda","Страница.dc.html?p=komanda"],["laboratoriya","Страница.dc.html?p=laboratoriya"],["tehnika","Страница.dc.html?p=tehnika"],["dokumenty","Страница.dc.html?p=dokumenty"],["kak-rabotaem","Страница.dc.html?p=kak-rabotaem"],["proverka","Страница.dc.html?p=proverka"],["voprosy","Страница.dc.html?p=voprosy"],["stati","Страница.dc.html?p=stati"],["statya","Страница.dc.html?p=statya"],["kontakty","Страница.dc.html?p=kontakty"],["spasibo","Страница.dc.html?p=spasibo"],["privacy","Страница.dc.html?p=privacy"],["pdf","PDF - Программа работ.dc.html"]];
const VIEWPORTS = [['desktop-1280', 1280, 820], ['mobile-390', 390, 844]];
const browser = await chromium.launch();
for (const [name, width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  for (const [i, [key, file]] of ROUTES.entries()) {
    await page.goto(BASE + encodeURI(file), { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `/ref/${name}/${String(i + 1).padStart(2, '0')}-${key}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Снапшот каждой стори из собранного Storybook. Новая стори — новый бейзлайн.
// Теги стори: `no-snapshot` — не снимать, `phone-only` — только на телефоне.
type Entry = { id: string; type: string; title: string; name: string; tags?: string[] };
const index = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as { entries: Record<string, Entry> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story' && !e.tags?.includes('no-snapshot'));

for (const story of stories) {
  test(`${story.title} / ${story.name}`, async ({ page }, info) => {
    test.skip(!!story.tags?.includes('phone-only') && info.project.name !== 'phone', 'только телефон');
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    await page.waitForFunction(() => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0);
    // Шрифты начинают грузиться только после отрисовки текста: ждём кадр, потом fonts.ready.
    const failed = await page.evaluate(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await document.fonts.ready;
      return [...document.fonts].filter((f) => f.status === 'error').map((f) => `${f.family} ${f.weight}`);
    });
    expect(failed, 'Шрифты не загрузились — снапшот был бы на запасном шрифте').toEqual([]);
    await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story.id}.png`);
  });
}

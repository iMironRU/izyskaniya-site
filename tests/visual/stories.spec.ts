import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Снапшот каждой стори из собранного Storybook. Новая стори — новый бейзлайн.
type Entry = { id: string; type: string; title: string; name: string; tags?: string[] };
const index = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as { entries: Record<string, Entry> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story' && !e.tags?.includes('no-snapshot'));

for (const story of stories) {
  test(`${story.title} / ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    await page.locator('#storybook-root').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story.id}.png`);
  });
}

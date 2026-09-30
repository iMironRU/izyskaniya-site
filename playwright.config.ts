import { defineConfig } from '@playwright/test';

// Гейт 2: визуальная регрессия по стори Storybook.
// Бейзлайны снимаются и сравниваются только в Docker-образе Playwright
// (шрифты и растеризация одинаковые). Запуск: npm run test:visual:docker
if (!process.env.PLAYWRIGHT_DOCKER) {
  throw new Error('Визуальные тесты запускаются только в Docker: npm run test:visual:docker');
}

const PORT = 6007;

export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__snapshots__/{arg}-{projectName}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0, animations: 'disabled', caret: 'hide' } },
  use: { baseURL: `http://127.0.0.1:${PORT}` },
  projects: [
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: `npx http-server storybook-static -p ${PORT} -s`,
    url: `http://127.0.0.1:${PORT}/iframe.html`,
    reuseExistingServer: !process.env.CI,
  },
});

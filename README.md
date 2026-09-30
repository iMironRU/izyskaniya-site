# Сайт инженерно-изыскательской компании

Сайт с калькулятором-генератором предварительной программы работ (геология, топосъёмка).

- Задача для разработки: [docs/code-prompt.md](docs/code-prompt.md)
- Бриф дизайнера: [docs/design-brief.md](docs/design-brief.md)
- План, решения, схемы данных: [docs/PLAN.md](docs/PLAN.md)
- Визуальный язык (канвас): https://claude.ai/artifact/JsFFPFjcMW8dZGtMRvwZUm — выбрано направление A «Технический отчёт»

**Истина — только то, что в git:** `tokens/*.json` и React-компоненты. Макеты — черновик.

## Команды

| Команда | Что делает |
|---|---|
| `npm run tokens` | Собирает токены в `build/` (запускается автоматически перед dev/build/storybook) |
| `npm run dev` | Сайт локально |
| `npm run build` | Статический экспорт в `out/` |
| `npm run storybook` | Витрина компонентов на :6006 |
| `npm run lint` | Гейт 1: ESLint + Stylelint |
| `npm test` | Тесты движка (vitest) |
| `npm run test:visual:docker` | Гейт 2: сравнение со снапшотами в Docker |
| `npm run test:visual:update` | Переснять снапшоты в Docker (тот же образ, что в CI) |

## Токены

```
tokens/primitive/   палитра, шрифты, шкалы отступов и радиусов
tokens/semantic/    решения: фон, текст, акцент, статусы, допущение
tokens/component/   точечные значения компонентов (button.json …)
```

`style-dictionary.config.js` (Style Dictionary v4, формат DTCG) собирает:
- `build/css/tokens.css` — все токены как `--tk-*`;
- `build/tailwind/theme.css` — тема Tailwind 4;
- `build/ts/tokens.js` + `.d.ts` — константы для TS.

**Отличие от документа стека.** В Tailwind 4 нет JS-пресетов, поэтому вместо `tailwind.preset.js` генерируется `build/tailwind/theme.css` с блоком `@theme`. Стандартная палитра и шкалы Tailwind в нём сброшены. В классах доступно только то, что есть в токенах:
- цвета — только semantic и component (`bg-bg-page`, `text-text-secondary`, `bg-button-primary-bg`), примитивная палитра в классах недоступна;
- отступы — шкала `space` (`p-4`, `gap-3`), размеры компонентов — `h-button-height-md`;
- шрифты: `font-display`, `font-body`, `font-code`; размеры текста `text-xs … text-5xl`.

Замена значений в `tokens/` меняет весь визуал без правок компонентов.

## Гейты

**Гейт 1 — линтеры** (`eslint.config.mjs`, `.stylelintrc.json`). Запрещены:
- классы Tailwind, которых нет в теме (`bg-red-500`);
- произвольные значения `[...]` (`p-[13px]`);
- hex-цвета, `px` и инлайн-`style` в `src/**/*.tsx`;
- hex, `rgb()/hsl()`, `px` в `src/**/*.css`.

Строки с классами, вынесенные в переменные, называйте `…Classes` (`variantClasses`), чтобы линтер их видел. Классы пишем обычными строками — так их правит Onlook.

**Гейт 2 — снапшоты** (`tests/visual/`). Каждая стори Storybook снимается на телефоне (390 px) и десктопе (1280 px). Бейзлайны лежат в `tests/visual/__snapshots__/` и снимаются только в Docker-образе `mcr.microsoft.com/playwright:v1.63.0-noble`. Вне Docker конфиг Playwright откажется запускаться. Переснять можно локально (`npm run test:visual:update`) или в CI: Actions → CI → Run workflow → `update_snapshots`. Стори с тегом `no-snapshot` не снимаются.

При обновлении `@playwright/test` меняйте версию образа в `tests/visual/docker.sh` и `.github/workflows/ci.yml`.

## Данные, demo-значения, TODO

Появятся на этапе 3. Здесь будет список всех `demo: true` и `TODO: верифицировать инженером`.

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

## Данные калькулятора

Все цены и правила — YAML в `data/`. В коде и вёрстке цифр нет: калькулятор, страница «Цены» и «от …» в карточках услуг считаются одним движком из этих файлов.

```
data/pricing.yaml            тарифы, зоны выезда (км от офиса), срочность, скидка пакета, вилка
data/questions/NN-*.yaml     вопросы квиза; порядок — по имени файла и внутри файла
data/rules/<услуга>.yaml     величины (скважины, глубина), правила-позиции, сроки, чек-лист клиента
```

**Как заполнять.**
- Цены без НДС (`vat: none`). После любой правки цен меняйте `version` в `pricing.yaml`: версия попадает в ссылку «Поделиться».
- Проверенное значение: `demo: false`. Проверенное инженером правило: `verified: true`, пункт норматива — в `norm.clause`; комментарий `# TODO: верифицировать инженером` удалите.
- Правила — это таблицы и выражения из белого списка: `table`, `lookup`, `sum`, `mul`, `div`, `max`, `min`, `ceil`, `if`, `answer`, `ref` (см. `src/engine/schema.ts`).
- У каждого вопроса обязателен вариант «не знаю» (`unknown`) с консервативным допущением. Исключение — `lead_only` (кадастровый номер: уходит только в заявку).
- Строки с запятой или двоеточием в YAML берите в кавычки.

**Проверка.** `npm run data:check` проверяет схемы (zod) и связи: тарифы существуют, `lookup` покрывает все варианты ответа, у каждого вопроса есть «не знаю», зоны выезда по возрастанию. Та же проверка запускается перед `npm run build` и в CI: ошибка в данных роняет сборку. После правки данных запустите `npm run data:report` и закоммитьте обновлённый отчёт.

**Список всех demo-значений и `TODO: верифицировать инженером`:** [docs/DATA-STATUS.md](docs/DATA-STATUS.md) (генерируется).

## Движок расчёта — `src/engine/`

Чистые функции на TypeScript без UI и I/O (кроме `load.ts`, который читает YAML на сборке).

| Файл | Что делает |
|---|---|
| `schema.ts` | zod-схемы данных и типы результата `Program` |
| `expr.ts` | вычисление выражений и условий из правил |
| `answers.ts` | видимость вопросов, «не знаю» → допущение, проверка ответов |
| `calculate.ts` | `calculate(data, answers) → Program`, `priceFrom`, `priceMatrix` |
| `validate.ts` | перекрёстная проверка данных |
| `share.ts` | ответы ↔ строка для URL «Поделиться» |

Тесты: `npm test`. Точные суммы проверяются на фикстуре `src/engine/__fixtures__/mini.ts`, реальные данные — перебором всех вариантов каждого вопроса и «не знаю» (`data.test.ts`).

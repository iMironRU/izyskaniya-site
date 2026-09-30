# Сайт инженерно-изыскательской компании

Сайт с калькулятором-генератором предварительной программы работ (геология, топосъёмка).

- Задача для разработки: [docs/code-prompt.md](docs/code-prompt.md)
- Бриф дизайнера: [docs/design-brief.md](docs/design-brief.md)
- План, решения, схемы данных: [docs/PLAN.md](docs/PLAN.md)
- **Дизайн:** хендофф дизайнера в [design/handoff/](design/handoff/README.md) — токены, анатомия 43 компонентов, контракты 25 страниц, HTML-прототипы (направление «Отчёт», рабочее название «Геоплан»)

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

## Сайт

Статический экспорт Next.js, адреса — как в `design/handoff/pages/*.md`:

| Адрес | Что | Источник |
|---|---|---|
| `/` | Главная | `src/app/page.tsx` + `data/site/home.yaml` |
| `/uslugi/` | Услуги с фильтром по задаче | `src/app/uslugi/` + `data/site/uslugi.yaml`, `directions.yaml` |
| `/uslugi/<направление>/` | Шаблон направления (геология — полный, геодезия — минимальный) | `src/app/uslugi/[direction]/` + `data/site/<id>.yaml` |
| `/uslugi/geodeziya/topo-gaz/` | Шаблон услуги | `data/site/topo-gaz.yaml` |
| `/ceny/` | Цены: матрица, таблицы, каталог | `data/site/ceny.yaml` |
| `/raschet/` | Калькулятор; сценарии `?s=dom\|proekt\|topo\|granicy` | `src/components/Calculator/`, `data/presets.yaml` |
| остальные 19 | Блочные страницы | `data/site/pages/<ключ>.yaml` → `src/site/ui/Blocks.tsx` |

Карта ключ → адрес — `src/site/routes.ts`; в данных ссылки пишутся ключом (`r: raschet?s=dom`).

**Метки в текстах `data/site/**`** подставляются на сборке:
- цены — `{{от:профиль}}`, `{{цена:профиль}}`, `{{срок:профиль}}`, `{{дни:профиль}}`; профили — `data/site/prices.yaml` (сценарий + ответы → движок, строка каталога или тариф);
- переменные модели цен — `{{v:bundle}}`, `{{v:urgent}}`, `{{v:free_km}}`, `{{v:vat}}`;
- реквизиты — `{{inn}}`, `{{ogrn}}`, `{{sro}}`, `{{phone}}`, `{{email}}`, `{{address}}` … из `data/company.yaml`.

Неизвестная метка, профиль или тип блока — ошибка сборки. Правка `data/pricing.yaml` меняет калькулятор, «Цены», карточки и тексты сразу.

## Компоненты

`components/*.md` — анатомия от дизайнера (копия `design/handoff/components`). Код — `src/components/<Имя>/`, у каждого компонента есть стори и снапшоты. Мелкие компоненты (arrow-link, breadcrumbs, section-heading, lead, fact-figure, tag, callout, norm-link, norm-quote, assumption-badge, empty-state, skeleton, rating) — в `src/components/Primitives/`.

## Токены

```
tokens/primitive/primitive.json   ← design/handoff/tokens/primitive.json (без изменений)
tokens/semantic/semantic.json     ← design/handoff/tokens/semantic.json
tokens/component/component.json   ← design/handoff/tokens/component.json
tokens/semantic/extensions.json   дополнения разработчика: плавные кегли, брейкпоинт шапки 1080,
                                  минимальные ширины колонок сеток, размеры просмотрщика и т. п.
```

`style-dictionary.config.js` (Style Dictionary v4, формат DTCG) собирает:
- `build/css/tokens.css` — все токены как `--tk-*`;
- `build/tailwind/theme.css` — тема Tailwind 4;
- `build/ts/tokens.js` + `.d.ts` — константы для TS.

**Отличие от документа стека.** В Tailwind 4 нет JS-пресетов, поэтому вместо `tailwind.preset.js` генерируется `build/tailwind/theme.css` с блоком `@theme`. Стандартная палитра и шкалы Tailwind в нём сброшены. В классах доступно только то, что есть в токенах:
- цвета — только semantic и component (`bg-bg-default`, `text-text-muted`, `border-button-primary-border`), примитивная палитра в классах недоступна;
- отступы — шкала `space` дизайнера (`p-4` = 18,4px, `p-16` = 16px), размеры компонентов — `min-h-button-height`, `size-tap`;
- шрифты `font-heading` (Cormorant Garamond) и `font-body` (Lora); кегли `text-10 … text-56`;
- составная типографика — утилиты `type-display`, `type-h2`, `type-h3`, `type-title-card`, `type-lead`, `type-body`, `type-small`, `type-kicker`, `type-figure` (H1 и H2 — плавные, 390 → 1280);
- раскладка — `page-x` (поля страницы), `section-y` (шаг секций), `grid-auto-card|sample|person|wide|timeline|footer|panel` (сетки `minmax(min(100%, N), 1fr)`).

Замена значений в `tokens/` меняет весь визуал без правок компонентов.

## Гейты

**Гейт 1 — линтеры** (`eslint.config.mjs`, `.stylelintrc.json`). Запрещены:
- классы Tailwind, которых нет в теме (`bg-red-500`);
- произвольные значения `[...]` (`p-[13px]`);
- hex-цвета, `px` и инлайн-`style` в `src/**/*.tsx`;
- hex, `rgb()/hsl()`, `px` в `src/**/*.css`.

Строки с классами, вынесенные в переменные, называйте `…Classes` (`variantClasses`), чтобы линтер их видел. Классы пишем обычными строками — так их правит Onlook.

**Гейт 2 — снапшоты** (`tests/visual/`). Каждая стори Storybook снимается на телефоне (390 px) и десктопе (1280 px). Бейзлайны лежат в `tests/visual/__snapshots__/` и снимаются только в Docker-образе `mcr.microsoft.com/playwright:v1.63.0-noble`. Вне Docker конфиг Playwright откажется запускаться. Переснять можно локально (`npm run test:visual:update`) или в CI: Actions → CI → Run workflow → `update_snapshots`. Стори с тегом `no-snapshot` не снимаются, с тегом `phone-only` — снимаются только на телефоне.

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

## Калькулятор — `/raschet/`

`src/app/raschet/page.tsx` читает `data/` на сборке и передаёт в клиентский `src/components/Calculator/Calculator.tsx`. Калькулятор рендерится только в браузере (`ssr: false`); без JS страница показывает телефон.

- **Один вопрос на экран.** Какие вопросы видны, решают `show_if` в данных (`quiz.ts` → `visibleQuestions`). Ответы на скрытые вопросы в расчёт и ссылку не попадают.
- **«Не знаю»** есть у каждого вопроса; выбранное допущение видно сразу под вопросом и в блоке «Что мы приняли за вас» с кнопкой «Уточнить».
- **Назад без потери ответов:** кнопка «Назад» и системная «назад» на телефоне. Шаг хранится в `#hash` адреса (`#floors`, `#result`), черновик ответов — в `sessionStorage` вкладки.
- **Клавиатура:** Tab — в группу вариантов, стрелки/Пробел — выбор, Enter — «Дальше». После перехода фокус на заголовке вопроса.
- **Место участка:** точка на карте (Leaflet + тайлы OpenStreetMap) → расстояние по прямой от офиса из `data/company.yaml` → зона выезда. Запасной путь без карты и с клавиатуры — вкладка «Расстояние в км».
- **Результат до контакта:** цена или вилка, срок, объём с обоснованием и нормативами, состав работ, расчёт цены, допущения, чек-лист «что подготовить».
- **Сценарии:** `?s=dom` (6 шагов, как в макете), `proekt`, `topo`, `granicy` — ветки задаются в `data/presets.yaml`, ответ `branch` и поля `ask_if`/`default` в вопросах.
- **Поделиться:** `/raschet/?r=<ответы+версия цен>#result`. Если с тех пор цены поменялись, расчёт по ссылке пересчитывается и показывает пометку. На телефоне — системное меню «Поделиться», на компьютере — копирование, иначе поле со ссылкой.
- **PDF:** `pdf.tsx` по макету `design/handoff/prototype/PDF - Программа работ.dc.html`, собирается в браузере `@react-pdf/renderer`, грузится лениво по кнопке. Шрифты — цельные TTF Cormorant Garamond и Lora в `assets/pdf-fonts/` (склеены из @fontsource скриптом `scripts/build-pdf-fonts.py`, лицензия OFL рядом), в `public/fonts/pdf/` копируются `npm run assets`. Макет без браузера: `npm run pdf:sample -- out.pdf`.
- **Заявка** — после результата: имя, телефон, способ связи, согласие на обработку данных; состояния «отправлено», «ошибка» с повтором, «нет сети» с автоповтором при появлении связи. Сейчас подключена заглушка `src/lead/demo.ts` — заявки никуда не уходят. Реальные адаптеры — этап 7.

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

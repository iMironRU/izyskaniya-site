# План и схемы данных

Статус: схемы подтверждены 30.09.2026. Этапы 1–3 сделаны.

## Принятые решения (30.09.2026)

| # | Вопрос | Решение |
|---|---|---|
| 1 | Мета-фреймворк | Next.js 16, статический экспорт, сборка `--webpack` (как в остальных наших сайтах) |
| 1a | Tailwind | Версия 4. JS-пресета нет: Style Dictionary генерирует `build/tailwind/theme.css` (`@theme`), стандартная палитра и шкалы Tailwind сброшены |
| 2 | Заявки | Интерфейс-адаптер; реализации Telegram и email |
| 3 | Хостинг | GitHub Pages (превью) + FTP на свой сервер (прод), как у orgmu-site |
| 4 | Выход калькулятора | Точная цена для типовых частных объектов, вилка для коммерческих; результат виден до ввода контакта |
| 5 | MVP | Геология + топосъёмка, архитектура расширяемая |
| 6 | Бренд | Нейтральный шаблон, бренд подставляется токенами. Стартовые значения — направление A «Технический отчёт» |
| 7 | Тема / изображения / правки дизайнера | Только светлая / графика из отраслевого словаря вместо фото / Onlook поверх Storybook, без отдельного канваса |

### Следствие для заявок
Токен Telegram-бота нельзя класть в статику. Поэтому адаптер на клиенте шлёт заявку на свой эндпоинт `POST /api/lead` — это маленький PHP-скрипт на нашем сервере (Apache + PHP уже есть на VestaCP). Скрипт пересылает заявку в Telegram и на почту. На GitHub Pages PHP нет, там форма работает в режиме «заглушка» (показывает, что было бы отправлено).

## Этапы

1. ✅ Решения, план, схемы (этот файл).
2. ✅ Каркас: токены → Style Dictionary → тема Tailwind → `Button` со стори и снапшотами → CI с двумя гейтами.
3. ✅ Схемы данных (zod), демо-данные, движок расчёта, табличные тесты vitest. Без UI.
4. Компоненты по `components/*.md` + Storybook + снапшоты.
5. Калькулятор (квиз), результат, PDF, «Поделиться».
6. Страницы из данных.
7. Заявки (адаптер + PHP-эндпоинт), SEO (schema.org, sitemap), Lighthouse mobile ≥ 90, деплой.

## Схемы данных (на подтверждение)

Все данные — YAML в `data/`, схемы — zod в `src/engine/schema.ts`. Проверка идёт на сборке (`prebuild`): ошибка в данных роняет сборку.
Любая цифра, которую не подтвердил инженер или бухгалтер, несёт `demo: true`. У нормативного правила есть `verified: false` и комментарий `# TODO: верифицировать инженером`.

```
data/
  company.yaml          паспорт компании, контакты, СРО, лаборатория, техника, документы
  pricing.yaml          ЕДИНСТВЕННЫЙ источник цен
  rules/geology.yaml    правила объёма работ по геологии
  rules/topo.yaml       правила по топосъёмке
  questions/geology.yaml, questions/topo.yaml   дерево вопросов квиза
  services/*.yaml       страницы услуг
  samples.yaml          образцы отчётов
  cases.yaml            объекты / кейсы
```

### pricing.yaml
```ts
Pricing = {
  version: string                     // меняется при любой правке; попадает в ссылку «Поделиться»
  currency: 'RUB'
  vat: 'included' | 'excluded' | 'none'
  rates: Array<{
    id: string                        // 'drilling.m', 'lab.sample', 'topo.ha' …
    title: string
    unit: 'м' | 'п.м' | 'га' | 'шт' | 'точка' | 'выезд' | 'объект'
    price: number
    min_charge?: number
    demo: boolean
    note?: string
  }>
  travel_zones: Array<{ id: string; title: string; max_km: number | null; price: number; demo: boolean }>
  urgency: Array<{ id: 'normal' | 'fast' | 'urgent'; title: string; multiplier: number; days_factor: number; demo: boolean }>
  bundle_discount: { services: ['geology', 'topo']; percent: number; demo: boolean }
  commercial_range: { low: number; high: number }   // множители вилки для коммерческих объектов
}
```
Страница «Цены» и цифры «от …» в карточках услуг считаются из `rates` и `rules` тем же движком. В вёрстке чисел нет.

### rules/*.yaml
```ts
Rule = {
  id: string
  applies_if?: Condition              // { answer: 'object_type', in: ['house'] } и т. п.
  produces: Array<{ rate: RateId; qty: Expr }>   // Expr — табличное значение или формула из белого списка
  basis: string                       // текст обоснования для клиента
  norm?: { code: string; clause?: string }       // 'СП 47.13330.2016', пункт — только после проверки
  verified: boolean                   // false, пока инженер не подтвердил
  demo: boolean
}
// Табличные правила (число скважин от пятна, глубина от этажности и фундамента)
// задаются таблицами-диапазонами, а не кодом.
```

### questions/*.yaml
```ts
Question = {
  id: string
  service: 'geology' | 'topo'
  title: string
  hint?: string
  why?: { text: string; norm?: NormRef }         // блок «Зачем мы это спрашиваем»
  kind: 'choice' | 'number' | 'location' | 'boolean'
  options?: Array<{ value: string; label: string; hint?: string }>
  number?: { unit: 'м' | 'м²' | 'га' | 'км'; min: number; max: number }
  unknown: { label: string; assume: Value; note: string }   // «не знаю» есть у каждого вопроса
  show_if?: Condition
}
```

### Результат движка
```ts
Program = {
  answers: Answers
  assumptions: Array<{ question: string; assumed: Value; note: string }>
  items: Array<{ service; rate: RateId; title; qty; unit; unit_price; total; basis: string; norm?: NormRef; demo: boolean }>
  duration_days: { min: number; max: number }
  price: { kind: 'exact'; total: number } | { kind: 'range'; min: number; max: number }
  bundle_discount?: { percent: number; amount: number }
  client_checklist: string[]          // что подготовить заказчику
  pricing_version: string
  has_demo_values: boolean            // пока true — в результате плашка «демо-цены»
}
```
Движок — чистые функции `(answers, data) → Program` без UI и без I/O.

### «Поделиться» и PDF
- Ответы кодируются в URL: `/calculator/?v=1&a=<base64url>`. В ссылку входит `pricing.version`. Если цены с тех пор изменились, результат пересчитывается по новым ценам и показывает пометку об этом.
- PDF собирается в браузере (`@react-pdf/renderer`, грузится лениво по кнопке) по макету A4 из брифа. Сервер для этого не нужен.

## Ответы по схемам
1. Цены без НДС.
2. Зона выезда — радиус в км от офиса. Выезд считается один раз на заказ; дальше последней зоны — «по согласованию», цена показывается вилкой.
3. Кадастровый номер — только для заявки, в расчёте не участвует.

Точная реализация схем — `src/engine/schema.ts` (она главнее эскизов выше).

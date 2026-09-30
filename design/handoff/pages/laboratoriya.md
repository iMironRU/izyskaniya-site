# Лаборатория

**URL:** `/o-kompanii/laboratoriya`  
**Прототип:** `Страница.dc.html?p=laboratoriya`  
**Ширина контента:** полная · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1, lead, facts |
| 2 | Перечень испытаний | table (правило А) | title, cols, rows, normCol |
| 3 | Оборудование | cards (+ section-chips-фильтр, sample-viewer) | title, min, items |
| 4 | Люди | cards/человек | title, items |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `laboratoriya`.
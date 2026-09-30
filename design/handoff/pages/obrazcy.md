# Образцы отчётов

**URL:** `/obrazcy`  
**Прототип:** `Страница.dc.html?p=obrazcy`  
**Ширина контента:** полная · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1, lead |
| 2 | cards | cards (+ section-chips-фильтр, sample-viewer) | viewer, filter, min, items, callouts |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

- Просмотрщик: полотно на весь экран, «Как читать» в нижней шторке.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `obrazcy`.
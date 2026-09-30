# О компании

**URL:** `/o-kompanii`  
**Прототип:** `Страница.dc.html?p=o-kompanii`  
**Ширина контента:** полная · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1, lead |
| 2 | Паспорт компании | passport-table (+ copy-button) | title, items |
| 3 | Цифры по годам | fact-figure, mini-chart | title, items, years |
| 4 | Подробнее | cards (+ section-chips-фильтр, sample-viewer) | title, min, items |
| 5 | Заказчики и партнёры | cards/логотип | title, n |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `o-kompanii`.
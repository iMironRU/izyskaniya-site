# Спасибо

**URL:** `/spasibo`  
**Прототип:** `Страница.dc.html?p=spasibo`  
**Ширина контента:** узкая, 880px · **Финальный CTA:** нет

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | check, h1, lead |
| 2 | Что будет дальше | нумерованный список | title, items |
| 3 | Пока ждёте | cards (+ section-chips-фильтр, sample-viewer) | title, min, items |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `spasibo`.
# Политика

**URL:** `/privacy`  
**Прототип:** `Страница.dc.html?p=privacy`  
**Ширина контента:** узкая, 880px · **Финальный CTA:** нет

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1, lead |
| 2 | article | оглавление, lead, norm-quote, callout, table, автор, связанная услуга | toc, paras |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `privacy`.
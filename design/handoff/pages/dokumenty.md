# Документы

**URL:** `/o-kompanii/dokumenty`  
**Прототип:** `Страница.dc.html?p=dokumenty`  
**Ширина контента:** полная · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1, lead |
| 2 | docs | cards/документ, button «Скачать всё» | all, items |
| 3 | Реквизиты | passport-table (+ copy-button) | title, copy, items |
| 4 | Проверить в реестрах | нумерованный список | title, items |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `dokumenty`.
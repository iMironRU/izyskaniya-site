# Контакты

**URL:** `/kontakty`  
**Прототип:** `Страница.dc.html?p=kontakty`  
**Ширина контента:** полная · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1 |
| 2 | contacts | телефон, мессенджеры, адреса, map, plate, callback-form |  |
| 3 | Реквизиты кратко | passport-table (+ copy-button) | title, items, link |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `kontakty`.
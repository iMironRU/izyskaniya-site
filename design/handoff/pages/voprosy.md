# Вопросы и ответы

**URL:** `/voprosy`  
**Прототип:** `Страница.dc.html?p=voprosy`  
**Ширина контента:** узкая, 880px · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1 |
| 2 | faq | faq-accordion (+ поиск, чипы разделов) | search, groups, items |
| 3 | callout | section-heading + callback-form | t, d, form |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `voprosy`.
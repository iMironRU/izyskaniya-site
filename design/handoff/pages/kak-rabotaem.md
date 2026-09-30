# Как мы работаем

**URL:** `/kak-rabotaem`  
**Прототип:** `Страница.dc.html?p=kak-rabotaem`  
**Ширина контента:** полная · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1, lead |
| 2 | Этапы | timeline | title, you, items |
| 3 | Договор | cards/документ, button «Скачать всё» | title, items |
| 4 | Оплата | table (правило А) | title, cols, rows |
| 5 | Гарантии в договоре | нумерованный список | title, items |
| 6 | Что будет, если… | faq-accordion (+ поиск, чипы разделов) | title, items |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `kak-rabotaem`.
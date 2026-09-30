# Проектировщикам

**URL:** `/proektirovshchikam`  
**Прототип:** `Страница.dc.html?p=proektirovshchikam`  
**Ширина контента:** полная · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1, lead, form |
| 2 | Что гарантируем | нумерованный список | title, note, items |
| 3 | Комплексные изыскания | table (правило А) | title, sub, cols, rows, normCol |
| 4 | Сроки по видам | table (правило А) | title, cols, rows |
| 5 | Документы для тендера | cards/документ, button «Скачать всё» | title, all, items |
| 6 | Образцы | cards (+ section-chips-фильтр, sample-viewer) | title, link, min, items |
| 7 | Кейсы прохождения экспертизы | cards (+ section-chips-фильтр, sample-viewer) | title, min, items |
| 8 | Нормативная база | norm-link + описание | title, items |
| 9 | Главный инженер на связи | cards/человек (крупно) + телефон | title, n, r, x, phone, email |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `proektirovshchikam`.
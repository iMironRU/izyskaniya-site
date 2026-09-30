# Кейс

**URL:** `/obekty/<кейс>`  
**Прототип:** `Страница.dc.html?p=keys`  
**Ширина контента:** полная · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, kicker, h1, lead |
| 2 | Параметры | passport-table (+ copy-button) | title, items |
| 3 | Этапы | timeline | title, photos, items |
| 4 | result | fact-figure крупно | v, d |
| 5 | Документы по кейсу | cards (+ section-chips-фильтр, sample-viewer) | title, min, items |
| 6 | Похожие объекты | cards (+ section-chips-фильтр, sample-viewer) | title, min, items |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `keys`.
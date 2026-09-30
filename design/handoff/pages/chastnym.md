# Частным застройщикам

**URL:** `/chastnym`  
**Прототип:** `Страница.dc.html?p=chastnym`  
**Ширина контента:** полная · **Финальный CTA:** да

## Блоки по порядку

| № | Блок | Компоненты | Данные (слоты) |
|---|---|---|---|
| 1 | Первый экран | breadcrumbs, h1, lead, fact-figure, button (+ callback-form kind=tz) | crumbs, h1, lead, actions |
| 2 | Путь участка | timeline | title, sub, items |
| 3 | Нужна ли геология для частного дома | fact-figure ×2, lead | title, text, items, note |
| 4 | Типовые пакеты | cards (+ section-chips-фильтр, sample-viewer) | title, min, items |
| 5 | Что вы получите и как это читать | plate + нумерованные выноски | title, ph, items |
| 6 | Отзывы частных клиентов | cards (+ section-chips-фильтр, sample-viewer) | title, min, items |
| 7 | Вопросы частных застройщиков | faq-accordion (+ поиск, чипы разделов) | title, items |

## Mobile

- Шапка mobile + sticky-bar «Позвонить / Рассчитать».
- Таблицы — по правилу А/Б/В (см. components/table.md). Горизонтальной прокрутки нет.

## Контент от заказчика

- Все тексты, цифры, фото и документы в прототипе — демо. Полный набор полей — в `pages-data.js`, ключ `chastnym`.
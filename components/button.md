# button

Кнопка действия. Основная — контур акцентом, без заливки.

## Части
- контейнер
- иконка слева (опц.)
- подпись
- иконка справа (опц.)

## Варианты
- primary — рамка gold, текст accent-800
- secondary — рамка border.default, текст ink
- ghost — без рамки, текст gold
- icon — 44×44, только иконка + aria-label
- block — на всю ширину (мобильные панели)

## Состояния
- default
- hover — фон accent.hover-tint (secondary: ink 7%)
- active — accent.active-tint
- focus-visible — кольцо 2px gold, offset 2px
- disabled — opacity 0.45, cursor not-allowed
- loading — подпись «Отправляем…», disabled

## Слоты / props
- children
- iconStart
- iconEnd

## Поведение
- Высота 48px на мобильном, 40px в шапке desktop
- Один primary на экран
- Шрифт Cormorant Garamond 600, 14–16px

## Токены
component.button.*

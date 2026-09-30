# option-tile

Плитка варианта ответа калькулятора.

## Части
- радио-точка
- заголовок
- подсказка
- бейдж «по умолчанию» (для «Не знаю»)

## Варианты
- обычный
- «Не знаю» — пунктирная точка

## Состояния
- default
- hover — рамка gold
- selected — рамка gold 2px (inset), фон 8% gold
- focus-visible — кольцо
- disabled — 0.45

## Слоты / props
- label
- hint
- icon

## Поведение
- role=radio, aria-checked; группа role=radiogroup
- Выбор не переключает шаг автоматически

## Токены
component.option-tile.*

# input

Поле ввода.

## Части
- label
- поле
- единица (м, м²)
- подсказка/ошибка

## Варианты
- text
- phone — маска +7 (XXX) XXX-XX-XX
- number-unit — inputmode=decimal, единица справа
- cadastral — маска NN:NN:NNNNNN(N):N…

## Состояния
- default
- hover — рамка neutral-600
- focus — рамка gold
- error — рамка gold + текст accent-800 под полем
- disabled

## Слоты / props
- label
- unit
- hint
- error

## Поведение
- Высота 52px, шрифт 17–22px tabular
- Валидация по «Далее», ошибка сбрасывается при вводе
- Enter = Далее в калькуляторе

## Токены
component.input.*

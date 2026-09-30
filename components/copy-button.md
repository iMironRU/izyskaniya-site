# copy-button

Копирование строки реквизитов.

## Части
- ghost-кнопка
- подпись

## Варианты
- строка
- «Копировать все»

## Состояния
- default «Копировать»
- done «Скопировано» 2 с
- error — тост «Не удалось скопировать»

## Слоты / props
- value

## Поведение
- navigator.clipboard.writeText
- aria-live на подписи

## Токены
component.button.ghost

# Field и поля ввода

`src/components/Field/`

**Field — обёртка:** подпись (`label`, 15 px, полужирная), подсказка под подписью (13 px, вторичный цвет), поле, сообщение об ошибке под полем (13 px, `status.error`, с иконкой). Подсказка и ошибка связаны с полем через `aria-describedby`, при ошибке у поля `aria-invalid`.

**Поле — общее:** высота 48 px (`field.height`), рамка 1 px `field.border` (контраст ≥ 3:1), белый фон, шрифт 16 px (чтобы iOS не увеличивал страницу).

**Состояния:** default; hover — `field.border-hover`; focus — рамка `field.border-focus` + общий контур; error — рамка `field.border-error`; disabled — фон `field.bg-disabled`.

**Варианты:**
- `NumberInput` — число с единицей измерения справа в отдельной плашке (`field.addon-bg`): «м», «га», «км». `inputmode="decimal"`, принимает запятую как разделитель.
- `PhoneInput` — `type="tel"`, `autocomplete="tel"`, формат `+7 (999) 123-45-67` по мере ввода, 8 в начале превращается в +7.
- `CadastralInput` — кадастровый номер `АА:ВВ:CCCCCCC:КК`, двоеточия расставляются сами, `inputmode="numeric"`. Пример формата в подсказке.
- `TextInput` — обычный текст (имя).

**Поведение:** форматирование — чистые функции в `src/lib/format.ts`, покрыты тестами.

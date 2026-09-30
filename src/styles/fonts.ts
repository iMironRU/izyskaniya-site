// Шрифты подключаются из JS, а не через @import в globals.css: Tailwind склеивает
// @import в один файл, и относительные пути к woff внутри @fontsource ломаются.
// Cormorant Garamond — заголовки и цифры, Lora — текст (design/handoff/README.md).
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/lora/400.css';
import '@fontsource/lora/400-italic.css';
import '@fontsource/lora/600.css';

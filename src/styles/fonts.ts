// Шрифты подключаются из JS, а не через @import в globals.css: Tailwind склеивает
// @import в один файл, и относительные пути к woff внутри @fontsource ломаются.
import '@fontsource/pt-serif/400.css';
import '@fontsource/pt-serif/700.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';

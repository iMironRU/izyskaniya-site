// Гейт 1 (JS/TSX): в вёрстке только значения из токенов.
//  - классы Tailwind — только существующие в теме (тема собирается из токенов);
//  - произвольные значения Tailwind `[...]` запрещены;
//  - hex-цвета и px в строках компонентов и страниц запрещены.
// Переменные со списками классов называем `...Classes` — их тоже проверяет линтер.
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults';

const HEX = '/#[0-9a-fA-F]{3,8}\\b/';
const PX = '/\\b\\d+(\\.\\d+)?px\\b/';

const restricted = [
  { selector: `Literal[value=${HEX}]`, message: 'Hex-цвет в коде запрещён: используйте токен.' },
  { selector: `TemplateElement[value.raw=${HEX}]`, message: 'Hex-цвет в коде запрещён: используйте токен.' },
  { selector: `Literal[value=${PX}]`, message: 'px в коде запрещены: используйте токен.' },
  { selector: `TemplateElement[value.raw=${PX}]`, message: 'px в коде запрещены: используйте токен.' },
  { selector: 'JSXAttribute[name.name="style"]', message: 'Инлайн-стили запрещены: только классы из токенов.' },
];

const config = [
  { ignores: ['.next/**', 'out/**', 'build/**', 'storybook-static/**', 'test-results/**', 'playwright-report/**', 'next-env.d.ts'] },
  ...nextVitals,
  ...nextTs,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'better-tailwindcss': betterTailwind },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/globals.css',
        selectors: [
          ...getDefaultSelectors(),
          { kind: 'variable', name: 'Classes$', match: [{ type: 'strings' }, { type: 'objectValues' }] },
        ],
      },
    },
    rules: {
      'better-tailwindcss/no-unknown-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-restricted-classes': [
        'error',
        { restrict: [{ pattern: '\\[.*\\]', message: 'Произвольное значение Tailwind «$0» запрещено: добавьте токен.' }] },
      ],
      'no-restricted-syntax': ['error', ...restricted],
    },
  },
  {
    // PDF: react-pdf принимает стили только через style={…} (это не CSS страницы). Hex и px по-прежнему запрещены.
    files: ['src/**/pdf.tsx'],
    rules: { 'no-restricted-syntax': ['error', ...restricted.filter((r) => !r.selector.startsWith('JSXAttribute'))] },
  },
  {
    // Витрина задаёт размеры вьюпортов в px — это не вёрстка сайта.
    files: ['.storybook/**'],
    rules: { 'no-restricted-syntax': 'off' },
  },
];

export default config;

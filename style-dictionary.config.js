// Сборка токенов: tokens/**/*.json (DTCG) → build/
//   build/css/tokens.css       — CSS-переменные --tk-* (все слои)
//   build/tailwind/theme.css   — тема Tailwind 4 (@theme), только из токенов
//   build/ts/tokens.js + .d.ts — константы для TS
//
// Tailwind 4 не использует JS-пресет: тема задаётся в CSS через @theme.
// Файл theme.css играет роль «пресета» из документа стека. Стандартная
// палитра и шкалы Tailwind сбрасываются (`--*-*: initial`), поэтому в классах
// доступны только значения из токенов.
import StyleDictionary from 'style-dictionary';

const PREFIX = 'tk';

const layerOf = (token) =>
  ['primitive', 'semantic', 'component'].find((l) => token.filePath.includes(`tokens/${l}/`));

// Куда токен попадает в теме Tailwind. null — не попадает.
// Цвета — только semantic и component: примитивная палитра в классах недоступна.
function themeVar(token) {
  const [head, ...rest] = token.path;
  const layer = layerOf(token);
  const type = token.$type;
  if (type === 'color') {
    if (layer === 'primitive') return null;
    return `--color-${(head === 'color' ? rest : token.path).join('-')}`;
  }
  if (head === 'font') {
    const [kind, ...name] = rest;
    const map = { family: 'font', size: 'text', weight: 'font-weight', leading: 'leading', tracking: 'tracking' };
    return map[kind] ? `--${map[kind]}-${name.join('-')}` : null;
  }
  if (head === 'space') return `--spacing-${rest.join('-')}`;
  if (head === 'radius') return `--radius-${rest.join('-')}`;
  if (head === 'breakpoint') return `--breakpoint-${rest.join('-')}`;
  if (layer === 'component' && type === 'dimension') return `--spacing-${token.path.join('-')}`;
  return null;
}

StyleDictionary.registerFormat({
  name: 'tailwind/theme',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens
      .map((t) => {
        const name = themeVar(t);
        if (!name) return null;
        // В медиазапросах var() не работает — брейкпоинты подставляются значением.
        const value = t.path[0] === 'breakpoint' ? t.$value : `var(--${t.name})`;
        return `  ${name}: ${value};`;
      })
      .filter(Boolean);
    return [
      '/* Сгенерировано style-dictionary.config.js. Не править руками. */',
      '@theme {',
      '  --color-*: initial;',
      '  --font-*: initial;',
      '  --text-*: initial;',
      '  --font-weight-*: initial;',
      '  --leading-*: initial;',
      '  --tracking-*: initial;',
      '  --spacing: initial;',
      '  --spacing-*: initial;',
      '  --radius-*: initial;',
      '  --shadow-*: initial;',
      '  --inset-shadow-*: initial;',
      '  --drop-shadow-*: initial;',
      '  --blur-*: initial;',
      '  --breakpoint-*: initial;',
      ...lines,
      '}',
      '',
    ].join('\n');
  },
});

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  usesDtcg: true,
  log: { warnings: 'error', verbosity: 'default' },
  platforms: {
    css: {
      prefix: PREFIX,
      transforms: ['attribute/cti', 'name/kebab', 'fontFamily/css'],
      buildPath: 'build/css/',
      files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }],
    },
    tailwind: {
      prefix: PREFIX,
      transforms: ['attribute/cti', 'name/kebab', 'fontFamily/css'],
      buildPath: 'build/tailwind/',
      files: [{ destination: 'theme.css', format: 'tailwind/theme' }],
    },
    ts: {
      transforms: ['attribute/cti', 'name/camel', 'fontFamily/css'],
      buildPath: 'build/ts/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
  },
});

await sd.buildAllPlatforms();

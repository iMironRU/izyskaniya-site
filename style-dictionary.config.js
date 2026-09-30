// Сборка токенов: tokens/**/*.json (DTCG) → build/
//   build/css/tokens.css       — CSS-переменные --tk-* (все слои)
//   build/tailwind/theme.css   — тема Tailwind 4 (@theme) + утилиты из составных токенов
//   build/ts/tokens.js + .d.ts — константы для TS (PDF, карта)
//
// Токены — из хендоффа дизайнера (design/handoff/tokens) без изменений, плюс
// tokens/semantic/extensions.json (что в хендоффе описано только текстом).
// Tailwind 4 не использует JS-пресет: роль пресета играет theme.css. Стандартная
// палитра и шкалы Tailwind сброшены — в классах доступно только то, что есть в токенах.
import StyleDictionary from 'style-dictionary';

const PREFIX = 'tk';
const v = (t) => `var(--${t.name})`;
const layerOf = (t) => ['primitive', 'semantic', 'component'].find((l) => t.filePath.includes(`tokens/${l}/`));
const isColor = (s) => typeof s === 'string' && /^(#|rgba?\()/.test(s);
const isLength = (s) => typeof s === 'string' && /^-?[\d.]+(px|rem|em|%)$/.test(s);

// Куда токен попадает в теме Tailwind: имя переменной темы или null.
function themeVar(t) {
  const p = t.path;
  const [head, ...rest] = p;
  const layer = layerOf(t);
  const value = t.$value;

  if (head === 'color') return layer === 'primitive' ? null : `--color-${rest.join('-')}`;
  if (head === 'color-ext') return `--color-${rest.join('-')}`;
  if (head === 'font') {
    const [kind, ...name] = rest;
    const map = { family: 'font', size: 'text', weight: 'font-weight', lineHeight: 'leading', tracking: 'tracking' };
    return map[kind] ? `--${map[kind]}-${name.join('-')}` : null;
  }
  if (head === 'space' || head === 'size') return `--spacing-${rest.join('-')}`;
  if (head === 'radius') return `--radius-${rest.join('-')}`;
  if (head === 'shadow') return `--shadow-${rest.join('-')}`;
  if (head === 'breakpoint') return rest[0] === 'max' ? '--container-page' : `--breakpoint-${rest.join('-')}`;
  if (head === 'breakpoint-ext') return `--breakpoint-${rest.join('-')}`;
  if (head === 'layout' && (rest[0] === 'measure' || rest[0] === 'narrow')) return `--container-${rest[0]}`;
  if (layer === 'component') {
    const name = p.join('-');
    if (isColor(value)) return `--color-${name}`;
    const last = p[p.length - 1];
    if (!isLength(value)) return null;
    if (last === 'radius') return `--radius-${p.slice(0, -1).join('-')}`;
    if (last.includes('size') && last !== 'radio-size') return `--text-${p.slice(0, -1).join('-')}`;
    if (last === 'border-width') return null;
    return `--spacing-${name}`;
  }
  return null;
}

const fluid = (min, max, vmin, vmax) =>
  `clamp(${min}, calc(${min} + (${parseFloat(max)} - ${parseFloat(min)}) * ((100vw - ${vmin}) / (${parseFloat(vmax)} - ${parseFloat(vmin)}))), ${max})`;

StyleDictionary.registerFormat({
  name: 'tailwind/theme',
  format: ({ dictionary }) => {
    const byPath = (s) => dictionary.allTokens.find((t) => t.path.join('.') === s);
    const lines = [];
    for (const t of dictionary.allTokens) {
      const name = themeVar(t);
      if (!name) continue;
      // В медиазапросах var() не работает — брейкпоинты подставляются значением.
      lines.push(`  ${name}: ${name.startsWith('--breakpoint') ? t.$value : v(t)};`);
    }

    // Составная типографика → утилиты type-*.
    const vmin = byPath('fluid.viewport-min').$value;
    const vmax = byPath('fluid.viewport-max').$value;
    const utilities = [];
    for (const t of dictionary.allTokens.filter((x) => x.path[0] === 'typography')) {
      const key = t.path[1];
      const o = t.$value;
      const fl = byPath(`fluid.${key}.min`);
      const size = fl ? fluid(fl.$value, byPath(`fluid.${key}.max`).$value, vmin, vmax) : o.fontSize;
      utilities.push(
        `@utility type-${key} {`,
        `  font-family: ${Array.isArray(o.fontFamily) ? o.fontFamily.map((f) => (f.includes(' ') ? `'${f}'` : f)).join(', ') : o.fontFamily};`,
        `  font-weight: ${o.fontWeight};`,
        `  font-size: ${size};`,
        `  line-height: ${o.lineHeight};`,
        ...(o.letterSpacing ? [`  letter-spacing: ${o.letterSpacing};`] : []),
        ...(key === 'kicker' ? ['  text-transform: uppercase;'] : []),
        ...(key === 'figure' ? ['  font-variant-numeric: tabular-nums;'] : []),
        '}',
      );
    }

    // Составные отступы компонентов («14px 16px») → утилиты p-*.
    for (const t of dictionary.allTokens.filter((x) => layerOf(x) === 'component' && x.path.at(-1).startsWith('padding') && !isLength(x.$value))) {
      const suffix = t.path.at(-1).replace(/^padding-?/, '');
      utilities.push(`@utility p-${[...t.path.slice(0, -1), suffix].filter(Boolean).join('-')} {`, `  padding: ${v(t)};`, '}');
    }

    // Поля страницы и шаг секций — плавные.
    const g = ['min', 'max'].map((m) => byPath(`fluid.gutter.${m}`).$value);
    const s = ['min', 'max'].map((m) => byPath(`fluid.section-gap.${m}`).$value);
    utilities.push(
      '@utility page-x {',
      `  padding-inline: ${fluid(g[0], g[1], vmin, vmax)};`,
      '}',
      // Половина шага на секцию сверху и снизу: между соседними секциями — ровно шаг из токенов.
      '@utility section-y {',
      `  padding-block: calc(${fluid(s[0], s[1], vmin, vmax)} / 2);`,
      '}',
      '@utility gap-section {',
      `  row-gap: ${fluid(s[0], s[1], vmin, vmax)};`,
      '}',
    );
    // Сетки auto-fill с минимальной шириной колонки из токенов grid.*.
    for (const t of dictionary.allTokens.filter((x) => x.path[0] === 'grid')) {
      const mode = ['timeline', 'footer'].includes(t.path[1]) ? 'auto-fit' : 'auto-fill';
      utilities.push(`@utility grid-auto-${t.path[1]} {`, `  grid-template-columns: repeat(${mode}, minmax(min(100%, ${v(t)}), 1fr));`, '}');
    }
    for (const k of ['disabled', 'dimmed']) utilities.push(`@utility opacity-${k} {`, `  opacity: var(--${PREFIX}-opacity-${k});`, '}');

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
      '  --container-*: initial;',
      '  --color-transparent: transparent;',
      '  --color-current: currentcolor;',
      ...lines,
      '}',
      '',
      ...utilities,
      '',
    ].join('\n');
  },
});

const transforms = ['attribute/cti', 'name/kebab', 'fontFamily/css', 'shadow/css/shorthand', 'typography/css/shorthand'];

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  usesDtcg: true,
  // Совпадающие $type у групп в разных слоях (color) — не ошибка; битые ссылки SD роняет всегда.
  log: { warnings: 'warn', verbosity: 'default' },
  platforms: {
    css: {
      prefix: PREFIX,
      transforms,
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
      transforms: ['attribute/cti', 'name/camel', 'fontFamily/css', 'shadow/css/shorthand', 'typography/css/shorthand'],
      buildPath: 'build/ts/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
  },
});

await sd.buildAllPlatforms();

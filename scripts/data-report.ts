// Отчёт о состоянии данных: все demo-значения и непроверенные правила.
//   npm run data:report  — перезаписать docs/DATA-STATUS.md
//   npm run data:check   — проверить data/ и что отчёт актуален (для CI и prebuild)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadCalcData } from '../src/engine/load';

const OUT = 'docs/DATA-STATUS.md';
const data = loadCalcData();
const { pricing } = data;
const money = (n: number | null) => (n === null ? 'по согласованию' : `${n.toLocaleString('ru-RU')} ₽`);

const rows: string[] = [];
const table = (head: string[], body: string[][]) => {
  rows.push(`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...body.map((r) => `| ${r.join(' | ')} |`), '');
};

rows.push(
  '# Состояние данных',
  '',
  'Сгенерировано `npm run data:report` из `data/`. Не править руками.',
  '',
  'Пока в списках ниже что-то есть, калькулятор показывает клиенту пометку «демо-цены» и «требует проверки инженером».',
  '',
  `Версия цен: \`${pricing.version}\`, НДС: ${pricing.vat === 'none' ? 'не облагается' : pricing.vat}.`,
  '',
  '## Demo-значения (`demo: true`)',
  '',
  '### Тарифы — `data/pricing.yaml`',
  '',
);
table(
  ['id', 'Работа', 'Цена', 'Минимум'],
  pricing.rates.filter((r) => r.demo).map((r) => [`\`${r.id}\``, r.title, `${money(r.price)} / ${r.unit}`, r.min_charge ? money(r.min_charge) : '—']),
);
rows.push('### Выезд, срочность, скидка, вилка — `data/pricing.yaml`', '');
table(
  ['Параметр', 'Значение'],
  [
    ...pricing.travel_zones.filter((z) => z.demo).map((z) => [`Зона ${z.title}`, money(z.price)]),
    ...pricing.urgency.filter((u) => u.demo).map((u) => [`Срочность «${u.title}»`, `×${u.multiplier} к цене, ×${u.days_factor} к сроку`]),
    ...(pricing.bundle_discount.demo ? [['Скидка пакета геология + топо', `${pricing.bundle_discount.percent} %`]] : []),
    ...(pricing.range.demo ? [['Вилка цены', `×${pricing.range.low} … ×${pricing.range.high}`]] : []),
  ],
);
rows.push('### Допущения для «не знаю» — `data/questions/`', '');
table(
  ['Вопрос', 'Допущение'],
  data.questions.filter((q) => q.unknown?.demo).map((q) => [`\`${q.id}\` ${q.title}`, JSON.stringify(q.unknown!.assume)]),
);
rows.push('### Сроки — `data/rules/`', '');
rows.push(...data.services.filter((s) => s.duration_days.demo).map((s) => `- ${s.title}`), '');

rows.push('## Правила, не проверенные инженером (`verified: false`)', '');
table(
  ['Услуга', 'id', 'Обоснование', 'Норматив'],
  data.services.flatMap((s) => [
    ...s.quantities.filter((q) => !q.verified).map((q) => [s.service, `\`${q.id}\``, q.basis, q.norm?.code ?? '—']),
    ...s.rules.filter((r) => !r.verified).map((r) => [s.service, `\`${r.id}\``, r.basis, r.norm?.code ?? '—']),
  ]),
);

rows.push('## `TODO: верифицировать инженером` в data/', '');
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.yaml') ? [join(dir, e.name)] : []));
for (const file of walk('data').sort()) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const m = line.match(/TODO: верифицировать инженером(.*)/);
      if (m) rows.push(`- \`${file}:${i + 1}\`${m[1].trim() ? ' ' + m[1].trim() : ''}`);
    });
}
rows.push('');

const report = rows.join('\n');
if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(OUT, 'utf8');
  } catch {}
  if (current !== report) {
    console.error(`${OUT} устарел: запустите npm run data:report и закоммитьте.`);
    process.exit(1);
  }
  console.log('data/ в порядке, отчёт актуален.');
} else {
  writeFileSync(OUT, report);
  console.log(`Записано: ${OUT}`);
}

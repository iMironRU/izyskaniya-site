// Загрузка и проверка data/*.yaml. Только для сборки и тестов (Node), в браузер не попадает.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as parseYaml } from 'js-yaml';
import { z } from 'zod';
import { crossCheck } from './validate';
import { Presets, Pricing, Questions, ServiceRules, type CalcData } from './schema';

const read = (file: string) => {
  try {
    return parseYaml(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`${file}: ${(e as Error).message.split('\n')[0]}`);
  }
};
const yamls = (dir: string) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((f) => join(dir, f));

function parse<T>(schema: z.ZodType<T>, value: unknown, file: string): T {
  const r = schema.safeParse(value);
  if (!r.success) throw new Error(`${file}:\n${z.prettifyError(r.error)}`);
  return r.data;
}

export function loadCalcData(root = 'data'): CalcData {
  const pricing = parse(Pricing, read(join(root, 'pricing.yaml')), 'pricing.yaml');
  // Порядок вопросов — по имени файла (01-common, 02-geology …), внутри файла — как записано.
  const questions = yamls(join(root, 'questions')).flatMap((f) => parse(Questions, read(f), f));
  const services = yamls(join(root, 'rules')).map((f) => parse(ServiceRules, read(f), f));

  const presets = parse(Presets, read(join(root, 'presets.yaml')), 'presets.yaml');

  const data = { pricing, questions, services, presets };
  const errors = crossCheck(data);
  if (errors.length) throw new Error(`Ошибки в data/:\n- ${errors.join('\n- ')}`);
  return data;
}

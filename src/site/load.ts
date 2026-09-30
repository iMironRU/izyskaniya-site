// Загрузка данных сайта на сборке (Node).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as parseYaml } from 'js-yaml';
import { z } from 'zod';
import { Company } from './schema';

export function loadCompany(root = 'data'): Company {
  const file = join(root, 'company.yaml');
  const r = Company.safeParse(parseYaml(readFileSync(file, 'utf8')));
  if (!r.success) throw new Error(`${file}:\n${z.prettifyError(r.error)}`);
  return r.data;
}

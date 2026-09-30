// Перекрёстная проверка данных: то, что zod по отдельным файлам поймать не может.
import { checkValue } from './answers';
import { SYSTEM_QUESTIONS } from './calculate';
import { referencedQuestions, referencedRefs } from './expr';
import type { CalcData, Expr, Question } from './schema';

function lookups(e: Expr | undefined, out: Array<{ q: string; keys: string[] }> = []) {
  if (e === undefined || typeof e === 'number') return out;
  if ('lookup' in e) out.push({ q: e.lookup.q, keys: Object.keys(e.lookup.map) });
  for (const k of ['sum', 'mul', 'max', 'min'] as const) if (k in e) (e as Record<typeof k, Expr[]>)[k].forEach((x) => lookups(x, out));
  if ('div' in e) e.div.forEach((x) => lookups(x, out));
  if ('ceil' in e) lookups(e.ceil, out);
  if ('if' in e) {
    lookups(e.then, out);
    lookups(e.else, out);
  }
  return out;
}

export function crossCheck(data: CalcData): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(m);
  const qById = new Map<string, Question>();

  for (const q of data.questions) {
    if (qById.has(q.id)) err(`Вопрос «${q.id}» объявлен дважды`);
    qById.set(q.id, q);
    if ((q.kind === 'choice' || q.kind === 'multi') && !q.options?.length) err(`Вопрос «${q.id}»: нет вариантов`);
    if (q.kind === 'number' && !q.number) err(`Вопрос «${q.id}»: нет параметров числа`);
    if (!q.lead_only && !q.unknown) err(`Вопрос «${q.id}»: нет варианта «не знаю»`);
    if (q.unknown) {
      const bad = checkValue(q, q.unknown.assume);
      if (bad) err(`Вопрос «${q.id}»: допущение не подходит — ${bad}`);
    }
  }

  for (const id of Object.values(SYSTEM_QUESTIONS)) if (!qById.has(id)) err(`Нет обязательного вопроса «${id}»`);

  const optionsOf = (id: string) => qById.get(id)?.options?.map((o) => o.value);
  const checkQ = (where: string, ids: Set<string>) => {
    for (const id of ids) if (!qById.has(id)) err(`${where}: ссылка на несуществующий вопрос «${id}»`);
  };
  const checkLookups = (where: string, e: Expr) => {
    for (const l of lookups(e)) {
      const opts = qById.get(l.q)?.kind === 'boolean' ? ['true', 'false'] : optionsOf(l.q);
      for (const o of opts ?? []) if (!l.keys.includes(o)) err(`${where}: lookup «${l.q}» не покрывает вариант «${o}»`);
    }
  };

  for (const q of data.questions) checkQ(`Вопрос «${q.id}» show_if`, referencedQuestions(q.show_if));

  const rateIds = new Set<string>();
  for (const r of data.pricing.rates) {
    if (rateIds.has(r.id)) err(`Тариф «${r.id}» объявлен дважды`);
    rateIds.add(r.id);
  }

  const zones = data.pricing.travel_zones;
  zones.forEach((z, i) => {
    const last = i === zones.length - 1;
    if (last && z.max_km !== null) err('Последняя зона выезда должна иметь max_km: null');
    if (!last && z.max_km === null) err(`Зона «${z.id}»: max_km: null допустимо только у последней`);
    if (i > 0 && z.max_km !== null && zones[i - 1].max_km! >= z.max_km) err('Зоны выезда должны идти по возрастанию max_km');
  });

  const urgencyQ = optionsOf(SYSTEM_QUESTIONS.urgency) ?? [];
  for (const u of urgencyQ) if (!data.pricing.urgency.some((x) => x.id === u)) err(`Нет режима срочности «${u}» в pricing.urgency`);

  for (const svc of data.services) {
    const where = (id: string) => `${svc.service}/${id}`;
    const defined = new Set<string>();
    for (const q of svc.quantities) {
      checkQ(where(q.id), referencedQuestions(q.expr));
      checkLookups(where(q.id), q.expr);
      for (const ref of referencedRefs(q.expr)) if (!defined.has(ref)) err(`${where(q.id)}: ссылка на «${ref}» до её определения`);
      defined.add(q.id);
    }
    for (const rule of svc.rules) {
      checkQ(where(rule.id), referencedQuestions(rule.qty));
      checkQ(where(rule.id), referencedQuestions(rule.applies_if));
      checkLookups(where(rule.id), rule.qty);
      for (const ref of referencedRefs(rule.qty)) if (!defined.has(ref)) err(`${where(rule.id)}: нет величины «${ref}»`);
      const ids = typeof rule.rate === 'string' ? [rule.rate] : Object.values(rule.rate.map);
      for (const id of ids) {
        const rate = data.pricing.rates.find((r) => r.id === id);
        if (!rate) err(`${where(rule.id)}: нет тарифа «${id}»`);
        else if (rate.service !== svc.service) err(`${where(rule.id)}: тариф «${id}» из другой услуги`);
      }
      if (typeof rule.rate !== 'string') {
        for (const o of optionsOf(rule.rate.by) ?? []) if (!(o in rule.rate.map)) err(`${where(rule.id)}: тариф не задан для «${rule.rate.by}=${o}»`);
      }
    }
    for (const [k, e] of Object.entries(svc.duration_days)) {
      if (typeof e === 'boolean') continue;
      checkQ(where(`duration.${k}`), referencedQuestions(e));
      for (const ref of referencedRefs(e)) if (!defined.has(ref)) err(`${where(`duration.${k}`)}: нет величины «${ref}»`);
    }
    for (const c of svc.checklist) checkQ(where('checklist'), referencedQuestions(c.applies_if));
  }

  return errors;
}

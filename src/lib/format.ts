// Форматирование для интерфейса и PDF. Чистые функции.

const NBSP = ' ';

/** 117800 → «117 800 ₽» (неразрывные пробелы). */
export function formatNumber(n: number): string {
  const [int, frac] = Math.abs(n).toFixed(n % 1 === 0 ? 0 : 2).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return (n < 0 ? '−' : '') + grouped + (frac ? ',' + frac.replace(/0+$/, '') : '');
}

export function formatMoney(n: number): string {
  return `${formatNumber(n)}${NBSP}₽`;
}

/** «12,5» / «12.5» / «12 500» → число; пусто или мусор → null. */
export function parseDecimal(s: string): number | null {
  const clean = s.replace(/[\s ]/g, '').replace(',', '.');
  if (!/^-?\d*\.?\d+$|^-?\d+\.$/.test(clean)) return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}

/** Оставляет в номере 10 цифр после кода страны. «8 999…» и «+7 999…» → «999…». */
export function phoneDigits(s: string): string {
  let d = s.replace(/\D/g, '');
  if (d.length > 10 && (d[0] === '7' || d[0] === '8')) d = d.slice(1);
  else if (d.length === 11) d = d.slice(1);
  return d.slice(0, 10);
}

/** Форматирует по мере ввода: «+7 (999) 123-45-67». */
export function formatPhone(s: string): string {
  const raw = s.replace(/\D/g, '');
  if (!raw) return '';
  const d = raw.length === 1 && (raw === '7' || raw === '8') ? '' : phoneDigits(s);
  let out = '+7';
  if (d.length > 0) out += ` (${d.slice(0, 3)}`;
  if (d.length >= 3) out += ')';
  if (d.length > 3) out += ` ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

export const isValidPhone = (s: string) => phoneDigits(s).length === 10;

/**
 * Кадастровый номер АА:ВВ:ССССССС:КК. Если пользователь сам ставит двоеточия —
 * уважаем их, иначе режем цифры по схеме 2:2:7:остаток.
 */
export function formatCadastral(s: string): string {
  if (s.includes(':')) {
    return s
      .split(':')
      .slice(0, 4)
      .map((p) => p.replace(/\D/g, ''))
      .join(':');
  }
  const d = s.replace(/\D/g, '').slice(0, 17);
  const parts = [d.slice(0, 2), d.slice(2, 4), d.slice(4, 11), d.slice(11)].filter(Boolean);
  return parts.join(':');
}

export const isValidCadastral = (s: string) => /^\d{2}:\d{2}:\d{6,7}:\d{1,6}$/.test(s);

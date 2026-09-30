/** Склейка классов. Имя `cn` линтер Tailwind распознаёт и проверяет аргументы. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

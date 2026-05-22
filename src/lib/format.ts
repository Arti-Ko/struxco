// Форматирование значений для интерфейса.

/** Форматирует сумму в рублях: 1240000 → «1 240 000 ₽». */
export function formatMoney(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

/** Компактная сумма для плотных таблиц: 1240000 → «1,24 млн ₽». */
export function formatMoneyShort(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("ru-RU", {
      maximumFractionDigits: 2,
    })} млн ₽`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} тыс ₽`;
  }
  return `${value} ₽`;
}

/** Диапазон бюджета: «от 1 200 000 до 1 600 000 ₽». */
export function formatBudgetRange(from: number, to: number): string {
  return `${from.toLocaleString("ru-RU")} – ${to.toLocaleString("ru-RU")} ₽`;
}

/** Дата ISO «2026-06-01» → «1 июн 2026». */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Короткая дата без года: «1 июн». */
export function formatDateShort(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

/** Диапазон сроков: «1 июн – 20 июл 2026». */
export function formatDateRange(start: string, end: string): string {
  return `${formatDateShort(start)} – ${formatDate(end)}`;
}

/** Склонение слова «день» по числу: 1 день, 2 дня, 5 дней. */
export function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} дня`;
  return `${n} дней`;
}

/** Текущее время в формате «ЧЧ:ММ» для лога и чата. */
export function nowTime(): string {
  return new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

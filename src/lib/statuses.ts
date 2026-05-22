// Конфигурация статусов: подписи и цвета строго по палитре ТЗ (п. 4.2, 8).

import type {
  Priority,
  ProjectStatus,
  ReviewPhase,
  Role,
  StageStatus,
} from "./types";

export interface StatusConfig {
  label: string;
  /** Базовый цвет статуса (hex из палитры ТЗ). */
  color: string;
}

/** Статусы проекта — яркие цвета для тёмной темы. */
export const PROJECT_STATUS: Record<ProjectStatus, StatusConfig> = {
  draft:       { label: "Черновик",   color: "#94a3b8" },
  tender:      { label: "Тендер",     color: "#60a5fa" },
  in_progress: { label: "В работе",   color: "#fbbf24" },
  review:      { label: "На приёмке", color: "#c084fc" },
  done:        { label: "Завершён",   color: "#34d399" },
};

/** Статусы этапа — яркие цвета для тёмной темы. */
export const STAGE_STATUS: Record<StageStatus, StatusConfig> = {
  needs_payment: { label: "Требует оплаты", color: "#94a3b8" },
  paid:          { label: "Оплачен",        color: "#60a5fa" },
  in_progress:   { label: "В работе",       color: "#fbbf24" },
  review:        { label: "На проверке",    color: "#c084fc" },
  rework:        { label: "На доработке",   color: "#f87171" },
  accepted:      { label: "Принят и оплачен", color: "#34d399" },
};

/** Порядок статусов этапа для выпадающего списка менеджера. */
export const STAGE_STATUS_ORDER: StageStatus[] = [
  "needs_payment",
  "paid",
  "in_progress",
  "review",
  "rework",
  "accepted",
];

export const PRIORITY: Record<Priority, StatusConfig> = {
  low:    { label: "Низкий",   color: "#94a3b8" },
  medium: { label: "Средний",  color: "#fbbf24" },
  high:   { label: "Высокий",  color: "#f87171" },
};

export const PRIORITY_ORDER: Priority[] = ["low", "medium", "high"];

/** Пояснение фазы приёмки — кто сейчас держит ход. */
export const REVIEW_PHASE_LABEL: Record<ReviewPhase, string> = {
  manager_check: "Проверяет менеджер",
  client_confirm: "Ожидает подтверждения клиента",
  awaiting_payout: "Ожидает выплаты из эскроу",
};

export const ROLE_LABEL: Record<Role, string> = {
  client: "Клиент",
  contractor: "Подрядчик",
  manager: "Менеджер",
};

/** Подзаголовок роли в шапке. */
export const ROLE_SUBTITLE: Record<Role, string> = {
  client: "Личный кабинет заказчика",
  contractor: "Личный кабинет исполнителя",
  manager: "Админ-панель платформы",
};

/**
 * Полупрозрачный фон-тинт для бейджа на основе hex-цвета.
 * Используется для мягкой заливки статусных бейджей.
 */
export function tint(hex: string, alpha = 0.14): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Затемнённый вариант цвета — для читаемого текста на светлом тинте. */
export function shade(hex: string, factor = 0.58): string {
  const value = hex.replace("#", "");
  const channel = (i: number) =>
    Math.round(parseInt(value.slice(i, i + 2), 16) * factor)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(0)}${channel(2)}${channel(4)}`;
}

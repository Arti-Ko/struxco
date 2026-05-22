// Доменная модель прототипа Struxco — B2B-платформа управления стройпроектами.

/** Три роли с принципиально разными интерфейсами. */
export type Role = "client" | "contractor" | "manager";

/** Статус проекта (см. п. 4.1 ТЗ). */
export type ProjectStatus =
  | "draft" // Черновик — ТЗ ожидает валидации менеджером
  | "tender" // Тендер — сбор и выбор КП
  | "in_progress" // В работе — идёт выполнение этапов
  | "review" // На приёмке — этап проходит проверку
  | "done"; // Завершён — все этапы приняты и оплачены

/** Статус этапа (единый перечень из 6 статусов, см. п. 4.2 ТЗ). */
export type StageStatus =
  | "needs_payment" // Требует оплаты — серый
  | "paid" // Оплачен — синий, средства в эскроу
  | "in_progress" // В работе — оранжевый
  | "review" // На проверке — жёлтый
  | "rework" // На доработке — красный
  | "accepted"; // Принят и оплачен — зелёный

/**
 * Внутренняя фаза приёмки. Видимый статус этапа всё время — «На проверке»,
 * но действие переходит между участниками: подрядчик → менеджер → клиент → выплата.
 */
export type ReviewPhase = "manager_check" | "client_confirm" | "awaiting_payout";

export type Priority = "low" | "medium" | "high";

export type FileKind = "tz" | "kp" | "report" | "contract" | "other";

export interface ProjectFile {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  uploadedBy: string;
  date: string;
}

/** Один этап рабочей таблицы проекта. */
export interface Stage {
  id: string;
  name: string;
  status: StageStatus;
  /** Активна только при status === "review". */
  reviewPhase?: ReviewPhase;
  amount: number;
  planStart: string;
  planEnd: string;
  /** Фото/видео-отчёты, приложенные при запросе приёмки. */
  reportFiles: ProjectFile[];
}

/** Этап внутри коммерческого предложения (до старта проекта). */
export interface ProposalStage {
  name: string;
  amount: number;
  durationDays: number;
}

/** Коммерческое предложение (КП) подрядчика. */
export interface Proposal {
  id: string;
  contractorId: string;
  contractorName: string;
  total: number;
  durationDays: number;
  comment: string;
  stages: ProposalStage[];
  /** КП проверено менеджером и передано клиенту. */
  validatedByManager: boolean;
}

export interface ChatMessage {
  id: string;
  authorRole: Role | "platform";
  authorName: string;
  text: string;
  time: string;
  attachment?: string;
}

export interface ActivityEntry {
  id: string;
  time: string;
  text: string;
  /** Роль-инициатор для цветовой пометки в логе. */
  actor: Role | "platform" | "system";
}

export interface Contractor {
  id: string;
  name: string;
  contactPerson: string;
  contact: string;
}

/** Проект — основная сущность. */
export interface Project {
  id: string;
  code: string; // человекочитаемый ID для админ-таблицы
  name: string;
  description: string;
  budgetFrom: number;
  budgetTo: number;
  desiredStart: string;
  desiredEnd: string;
  status: ProjectStatus;
  priority: Priority;
  archived: boolean;
  clientName: string;
  clientContact: string;
  /** Подрядчики, приглашённые менеджером в закрытый тендер. */
  invitedContractorIds: string[];
  contractorId?: string;
  contractorName?: string;
  selectedProposalId?: string;
  proposals: Proposal[];
  stages: Stage[];
  files: ProjectFile[];
  messages: ChatMessage[];
  activity: ActivityEntry[];
}

/** Вкладки карточки проекта. */
export type ProjectTab = "tender" | "stages" | "chat" | "documents";

/** Текущий экран приложения (навигация в памяти, без роутинга). */
export type Screen =
  | { name: "login" }
  | { name: "dashboard" }
  | { name: "create" }
  | { name: "project"; projectId: string; tab: ProjectTab };

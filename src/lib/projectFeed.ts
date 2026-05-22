// Conversation-first project view: lift project data into a single typed feed.
// Все события (сообщения, файлы, КП, журнал, запросы приёмки) кладутся
// в один хронологический поток `FeedEvent[]` для отрисовки в `ProjectFeed`.

import type {
  ActivityEntry,
  Project,
  ProjectFile,
  Proposal,
  Role,
  Stage,
} from "@/lib/types";

export type EventActor = ActivityEntry["actor"];

interface FeedEventBase {
  /** Уникальный id события в ленте (с префиксом по типу). */
  id: string;
  /** Сортируемый таймстемп в миллисекундах. */
  at: number;
  /** Исходная человекочитаемая метка времени из источника. */
  atLabel: string;
}

export interface MessageEvent extends FeedEventBase {
  kind: "message";
  authorRole: Role | "platform";
  authorName: string;
  text: string;
  attachment?: string;
}

export interface FileUploadedEvent extends FeedEventBase {
  kind: "file_uploaded";
  file: ProjectFile;
}

export interface ProposalSubmittedEvent extends FeedEventBase {
  kind: "proposal_submitted";
  proposal: Proposal;
}

/** Запрос приёмки этапа — синтетическое событие из stage.status === "review". */
export interface AcceptanceRequestEvent extends FeedEventBase {
  kind: "acceptance_request";
  stage: Stage;
}

export interface ActivityEvent extends FeedEventBase {
  kind: "activity";
  actor: EventActor;
  text: string;
}

export type FeedEvent =
  | MessageEvent
  | FileUploadedEvent
  | ProposalSubmittedEvent
  | AcceptanceRequestEvent
  | ActivityEvent;

export type FeedFilter = "all" | "discussion" | "files" | "stages" | "escrow";

/**
 * Парсит человекочитаемые метки времени прототипа в миллисекунды.
 *   "сегодня, 11:30"   → сегодня 11:30
 *   "14.05, 11:30"     → текущий год, 14 мая, 11:30
 *   "2026-05-21"       → 00:00 этого дня
 * При неизвестном формате возвращает 0 (отправляется в самое начало).
 */
export function parseTime(label: string): number {
  const s = label.trim();
  if (s.startsWith("сегодня")) {
    const m = s.match(/(\d{1,2}):(\d{2})/);
    const d = new Date();
    if (m) d.setHours(Number(m[1]), Number(m[2]), 0, 0);
    return d.getTime();
  }
  const dm = s.match(/^(\d{1,2})\.(\d{1,2}),\s*(\d{1,2}):(\d{2})$/);
  if (dm) {
    const year = new Date().getFullYear();
    return new Date(
      year,
      Number(dm[2]) - 1,
      Number(dm[1]),
      Number(dm[3]),
      Number(dm[4]),
    ).getTime();
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(s).getTime();
  }
  return 0;
}

/**
 * Маппит проект в плоский хронологический список событий.
 * Сортировка: от самого старого к самому свежему.
 */
export function deriveFeedEvents(project: Project): FeedEvent[] {
  const events: FeedEvent[] = [];

  for (const m of project.messages) {
    events.push({
      kind: "message",
      id: `m-${m.id}`,
      at: parseTime(m.time),
      atLabel: m.time,
      authorRole: m.authorRole,
      authorName: m.authorName,
      text: m.text,
      attachment: m.attachment,
    } satisfies MessageEvent);
  }

  for (const f of project.files) {
    events.push({
      kind: "file_uploaded",
      id: `f-${f.id}`,
      at: parseTime(f.date),
      atLabel: f.date,
      file: f,
    } satisfies FileUploadedEvent);
  }

  for (const a of project.activity) {
    events.push({
      kind: "activity",
      id: `a-${a.id}`,
      at: parseTime(a.time),
      atLabel: a.time,
      actor: a.actor,
      text: a.text,
    } satisfies ActivityEvent);
  }

  // Proposals don't carry their own timestamp в текущей модели — якорим к
  // «сегодня» с небольшим оффсетом по индексу, чтобы порядок был стабильным.
  project.proposals.forEach((p, idx) => {
    events.push({
      kind: "proposal_submitted",
      id: `p-${p.id}`,
      at: Date.now() - (project.proposals.length - idx) * 60_000,
      atLabel: "сегодня",
      proposal: p,
    } satisfies ProposalSubmittedEvent);
  });

  // Запрос приёмки — синтетический CTA-блок, всегда внизу ленты для
  // этапов в review-состоянии. Не дублирует activity-записи, а даёт
  // inline-actions для перехода между фазами приёмки.
  for (const s of project.stages) {
    if (s.status === "review") {
      events.push({
        kind: "acceptance_request",
        id: `ar-${s.id}`,
        at: Date.now() + 1, // в самый конец
        atLabel: "сейчас",
        stage: s,
      } satisfies AcceptanceRequestEvent);
    }
  }

  events.sort((a, b) => a.at - b.at);
  return events;
}

/** Фильтрация ленты по типу события. */
export function filterFeed(
  events: FeedEvent[],
  filter: FeedFilter,
): FeedEvent[] {
  if (filter === "all") return events;
  if (filter === "discussion") {
    return events.filter((e) => e.kind === "message");
  }
  if (filter === "files") {
    return events.filter((e) => e.kind === "file_uploaded");
  }
  if (filter === "stages") {
    return events.filter(
      (e) =>
        e.kind === "acceptance_request" ||
        (e.kind === "activity" && /этап/i.test(e.text)),
    );
  }
  if (filter === "escrow") {
    return events.filter(
      (e) => e.kind === "activity" && /эскроу|выплат/i.test(e.text),
    );
  }
  return events;
}

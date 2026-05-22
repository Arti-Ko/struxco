// Глобальное состояние прототипа (Zustand). Один SPA, навигация в памяти,
// все действия сквозного сценария меняют статичные данные на месте.

import { create } from "zustand";
import { nowTime } from "@/lib/format";
import type {
  ActivityEntry,
  ChatMessage,
  Priority,
  Project,
  ProjectStatus,
  ProjectTab,
  Proposal,
  ProposalStage,
  Role,
  Screen,
  Stage,
  StageStatus,
} from "@/lib/types";
import {
  buildSeedProjects,
  CONTRACTORS,
  CURRENT_CONTRACTOR_ID,
  MANAGER,
} from "./seed";

export type BannerTone = "info" | "success" | "warning";
export interface Banner {
  tone: BannerTone;
  text: string;
}

interface NewProjectInput {
  name: string;
  description: string;
  budgetFrom: number;
  budgetTo: number;
  desiredStart: string;
  desiredEnd: string;
  fileNames: string[];
}

interface AppState {
  loggedIn: boolean;
  role: Role;
  screen: Screen;
  projects: Project[];
  banner: Banner | null;

  login: () => void;
  logout: () => void;
  setRole: (role: Role) => void;
  goToDashboard: () => void;
  goToCreate: () => void;
  openProject: (projectId: string, tab?: ProjectTab) => void;
  setTab: (tab: ProjectTab) => void;
  dismissBanner: () => void;

  createProject: (input: NewProjectInput) => void;
  managerOpenTender: (projectId: string) => void;
  managerUpdateTz: (projectId: string, patch: Partial<Project>) => void;
  contractorSubmitProposal: (
    projectId: string,
    proposal: {
      total: number;
      durationDays: number;
      comment: string;
      stages: ProposalStage[];
    },
  ) => void;
  managerValidateProposal: (projectId: string, proposalId: string) => void;
  clientSelectProposal: (projectId: string, proposalId: string) => void;

  payStage: (projectId: string, stageId: string) => void;
  startStageWork: (projectId: string, stageId: string) => void;
  requestAcceptance: (
    projectId: string,
    stageId: string,
    fileNames: string[],
  ) => void;
  managerPassToClient: (projectId: string, stageId: string) => void;
  clientConfirmAcceptance: (projectId: string, stageId: string) => void;
  managerPayout: (projectId: string, stageId: string) => void;
  managerReturnToRework: (projectId: string, stageId: string) => void;
  managerSetStageStatus: (
    projectId: string,
    stageId: string,
    status: StageStatus,
  ) => void;
  managerUpdateStage: (
    projectId: string,
    stageId: string,
    patch: Partial<Stage>,
  ) => void;
  managerAddStage: (projectId: string) => void;

  managerSetProjectStatus: (projectId: string, status: ProjectStatus) => void;
  managerSetPriority: (projectId: string, priority: Priority) => void;
  toggleArchive: (projectId: string) => void;
  sendMessage: (projectId: string, text: string) => void;
}

let idCounter = 0;
function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

const PLATFORM_NAME = "Платформа Struxco";

/** Запись в журнал действий проекта. */
function logEntry(text: string, actor: ActivityEntry["actor"]): ActivityEntry {
  return { id: uid("act"), time: `сегодня, ${nowTime()}`, text, actor };
}

/** Системное сообщение от платформы в чат проекта. */
function platformMessage(text: string): ChatMessage {
  return {
    id: uid("msg"),
    authorRole: "platform",
    authorName: PLATFORM_NAME,
    text,
    time: `сегодня, ${nowTime()}`,
  };
}

/** Пересчёт статуса проекта по статусам этапов (для in_progress/review/done). */
function recomputeStatus(project: Project): ProjectStatus {
  if (project.status === "draft" || project.status === "tender") {
    return project.status;
  }
  if (project.stages.length === 0) return project.status;
  if (project.stages.every((s) => s.status === "accepted")) return "done";
  if (project.stages.some((s) => s.status === "review")) return "review";
  return "in_progress";
}

/** Раскладывает этапы КП по календарю последовательно от даты старта проекта. */
function datedStages(start: string, proposalStages: ProposalStage[]): Stage[] {
  let cursor = new Date(start);
  return proposalStages.map((ps) => {
    const planStart = cursor.toISOString().slice(0, 10);
    const end = new Date(cursor);
    end.setDate(end.getDate() + Math.max(1, ps.durationDays));
    const planEnd = end.toISOString().slice(0, 10);
    cursor = new Date(end);
    cursor.setDate(cursor.getDate() + 1);
    return {
      id: uid("st"),
      name: ps.name,
      status: "needs_payment" as StageStatus,
      amount: ps.amount,
      planStart,
      planEnd,
      reportFiles: [],
    };
  });
}

export const useAppStore = create<AppState>((set) => {
  /** Иммутабельно обновляет один проект и возвращает новый список. */
  const patchProject = (
    state: AppState,
    projectId: string,
    updater: (p: Project) => Project,
  ): Project[] =>
    state.projects.map((p) => (p.id === projectId ? updater(p) : p));

  return {
    loggedIn: false,
    role: "client",
    screen: { name: "login" },
    projects: buildSeedProjects(),
    banner: null,

    login: () => set({ loggedIn: true, screen: { name: "dashboard" } }),
    logout: () =>
      set({ loggedIn: false, screen: { name: "login" }, banner: null }),

    setRole: (role) =>
      set((state) => ({
        role,
        banner: null,
        // Форма создания доступна только клиенту.
        screen:
          state.screen.name === "create" && role !== "client"
            ? { name: "dashboard" }
            : state.screen,
      })),

    goToDashboard: () =>
      set({ screen: { name: "dashboard" }, banner: null }),
    goToCreate: () => set({ screen: { name: "create" }, banner: null }),

    openProject: (projectId, tab) =>
      set((state) => {
        const project = state.projects.find((p) => p.id === projectId);
        const fallback: ProjectTab =
          project?.status === "tender" ? "tender" : "stages";
        return {
          screen: { name: "project", projectId, tab: tab ?? fallback },
          banner: null,
        };
      }),

    setTab: (tab) =>
      set((state) =>
        state.screen.name === "project"
          ? { screen: { ...state.screen, tab } }
          : {},
      ),

    dismissBanner: () => set({ banner: null }),

    createProject: (input) =>
      set((state) => {
        const id = uid("proj");
        const code = `STX-${105 + state.projects.length}`;
        const today = new Date().toISOString().slice(0, 10);
        const project: Project = {
          id,
          code,
          name: input.name,
          description: input.description,
          budgetFrom: input.budgetFrom,
          budgetTo: input.budgetTo,
          desiredStart: input.desiredStart,
          desiredEnd: input.desiredEnd,
          status: "draft",
          priority: "medium",
          archived: false,
          clientName: state.projects[0]?.clientName ?? "Клиент",
          clientContact: state.projects[0]?.clientContact ?? "",
          invitedContractorIds: [],
          proposals: [],
          stages: [],
          files: input.fileNames.map((name) => ({
            id: uid("file"),
            name,
            kind: "tz" as const,
            size: "—",
            uploadedBy: "Клиент",
            date: today,
          })),
          messages: [
            platformMessage(
              "ТЗ получено. Менеджер платформы изучит детали и откроет тендер.",
            ),
          ],
          activity: [
            logEntry("Клиент создал проект и отправил ТЗ на согласование", "client"),
          ],
        };
        return {
          projects: [project, ...state.projects],
          screen: { name: "project", projectId: id, tab: "stages" },
          banner: {
            tone: "success",
            text: "ТЗ отправлено менеджеру на согласование. Статус проекта — «Черновик».",
          },
        };
      }),

    managerOpenTender: (projectId) =>
      set((state) => {
        const today = new Date().toISOString().slice(0, 10);
        return {
          projects: patchProject(state, projectId, (p) => {
            // Платформа сразу приглашает 2 аккредитованных подрядчиков;
            // второй подрядчик подаёт КП оперативно (готовое предложение).
            const other = CONTRACTORS.find(
              (c) => c.id !== CURRENT_CONTRACTOR_ID,
            )!;
            const total = Math.round((p.budgetTo * 0.92) / 1000) * 1000;
            const stageShare: ProposalStage[] = [
              { name: "Демонтаж и подготовка", amount: Math.round(total * 0.18), durationDays: 14 },
              { name: "Инженерные системы", amount: Math.round(total * 0.34), durationDays: 30 },
              { name: "Чистовая отделка", amount: Math.round(total * 0.32), durationDays: 26 },
              { name: "Финишные работы и сдача", amount: Math.round(total * 0.16), durationDays: 16 },
            ];
            const autoProposal: Proposal = {
              id: uid("pr"),
              contractorId: other.id,
              contractorName: other.name,
              total,
              durationDays: 86,
              comment:
                "Готовы приступить сразу после согласования. Своя бригада и техника.",
              stages: stageShare,
              validatedByManager: true,
            };
            return {
              ...p,
              status: "tender",
              invitedContractorIds: CONTRACTORS.map((c) => c.id),
              proposals: [autoProposal],
              files: [
                ...p.files,
                {
                  id: uid("file"),
                  name: `КП_${other.name}.pdf`,
                  kind: "kp" as const,
                  size: "1,1 МБ",
                  uploadedBy: other.contactPerson,
                  date: today,
                },
              ],
              messages: [
                ...p.messages,
                platformMessage(
                  "Тендер открыт. В short-list приглашены 2 проверенных подрядчика.",
                ),
              ],
              activity: [
                ...p.activity,
                logEntry(
                  "Менеджер согласовал ТЗ и открыл закрытый тендер",
                  "platform",
                ),
                logEntry(
                  `Подрядчик «${other.name}» подал КП — проверено менеджером`,
                  "platform",
                ),
              ],
            };
          }),
          banner: {
            tone: "info",
            text: "Тендер открыт. Приглашены 2 подрядчика, КП собираются.",
          },
        };
      }),

    managerUpdateTz: (projectId, patch) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => ({
          ...p,
          ...patch,
          activity: [
            ...p.activity,
            logEntry("Менеджер отредактировал поля ТЗ проекта", "platform"),
          ],
        })),
      })),

    contractorSubmitProposal: (projectId, proposal) =>
      set((state) => {
        const me = CONTRACTORS.find((c) => c.id === CURRENT_CONTRACTOR_ID)!;
        return {
          projects: patchProject(state, projectId, (p) => ({
            ...p,
            proposals: [
              ...p.proposals,
              {
                id: uid("pr"),
                contractorId: me.id,
                contractorName: me.name,
                total: proposal.total,
                durationDays: proposal.durationDays,
                comment: proposal.comment,
                stages: proposal.stages,
                validatedByManager: false,
              },
            ],
            files: [
              ...p.files,
              {
                id: uid("file"),
                name: `КП_${me.name}.pdf`,
                kind: "kp" as const,
                size: "1,2 МБ",
                uploadedBy: me.contactPerson,
                date: new Date().toISOString().slice(0, 10),
              },
            ],
            messages: [
              ...p.messages,
              {
                id: uid("msg"),
                authorRole: "contractor" as const,
                authorName: me.contactPerson,
                text: "Коммерческое предложение отправлено. Готовы обсудить детали.",
                time: `сегодня, ${nowTime()}`,
              },
            ],
            activity: [
              ...p.activity,
              logEntry(`Подрядчик «${me.name}» подал КП`, "contractor"),
            ],
          })),
          banner: {
            tone: "success",
            text: "КП отправлено. Менеджер платформы проверит предложение и передаст клиенту.",
          },
        };
      }),

    managerValidateProposal: (projectId, proposalId) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const proposal = p.proposals.find((pr) => pr.id === proposalId);
          return {
            ...p,
            proposals: p.proposals.map((pr) =>
              pr.id === proposalId ? { ...pr, validatedByManager: true } : pr,
            ),
            activity: [
              ...p.activity,
              logEntry(
                `Менеджер проверил КП «${proposal?.contractorName ?? ""}» и передал клиенту`,
                "platform",
              ),
            ],
          };
        }),
        banner: {
          tone: "success",
          text: "КП проверено и передано клиенту в сравнение.",
        },
      })),

    clientSelectProposal: (projectId, proposalId) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const proposal = p.proposals.find((pr) => pr.id === proposalId);
          if (!proposal) return p;
          return {
            ...p,
            status: "in_progress",
            contractorId: proposal.contractorId,
            contractorName: proposal.contractorName,
            selectedProposalId: proposalId,
            stages: datedStages(p.desiredStart, proposal.stages),
            messages: [
              ...p.messages,
              platformMessage(
                `Клиент выбрал подрядчика «${proposal.contractorName}». Сформирована таблица этапов — можно оплачивать первый этап.`,
              ),
            ],
            activity: [
              ...p.activity,
              logEntry(
                `Клиент выбрал подрядчика «${proposal.contractorName}» — проект переведён в работу`,
                "client",
              ),
            ],
          };
        }),
        banner: {
          tone: "success",
          text: "Подрядчик выбран. Этапы КП сформировали рабочую таблицу проекта.",
        },
      })),

    payStage: (projectId, stageId) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const stage = p.stages.find((s) => s.id === stageId);
          const updated = {
            ...p,
            stages: p.stages.map((s) =>
              s.id === stageId ? { ...s, status: "paid" as StageStatus } : s,
            ),
            activity: [
              ...p.activity,
              logEntry(
                `Этап «${stage?.name}» оплачен — средства зарезервированы в эскроу`,
                "client",
              ),
            ],
          };
          return { ...updated, status: recomputeStatus(updated) };
        }),
        banner: {
          tone: "success",
          text: "Этап оплачен. Средства зарезервированы в эскроу до приёмки результата.",
        },
      })),

    startStageWork: (projectId, stageId) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const stage = p.stages.find((s) => s.id === stageId);
          const updated = {
            ...p,
            stages: p.stages.map((s) =>
              s.id === stageId
                ? { ...s, status: "in_progress" as StageStatus }
                : s,
            ),
            activity: [
              ...p.activity,
              logEntry(`Подрядчик начал работу над этапом «${stage?.name}»`, "contractor"),
            ],
          };
          return { ...updated, status: recomputeStatus(updated) };
        }),
        banner: { tone: "info", text: "Этап в работе." },
      })),

    requestAcceptance: (projectId, stageId, fileNames) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const stage = p.stages.find((s) => s.id === stageId);
          const today = new Date().toISOString().slice(0, 10);
          const reports = fileNames.map((name) => ({
            id: uid("file"),
            name,
            kind: "report" as const,
            size: "—",
            uploadedBy: p.contractorName ?? "Подрядчик",
            date: today,
          }));
          const updated = {
            ...p,
            stages: p.stages.map((s) =>
              s.id === stageId
                ? {
                    ...s,
                    status: "review" as StageStatus,
                    reviewPhase: "manager_check" as const,
                    reportFiles: [...s.reportFiles, ...reports],
                  }
                : s,
            ),
            files: [...p.files, ...reports],
            messages: [
              ...p.messages,
              platformMessage(
                `Подрядчик запросил приёмку этапа «${stage?.name}». Отчёт на проверке у менеджера.`,
              ),
            ],
            activity: [
              ...p.activity,
              logEntry(
                `Подрядчик запросил приёмку этапа «${stage?.name}» с фото/видео-отчётом`,
                "contractor",
              ),
            ],
          };
          return { ...updated, status: recomputeStatus(updated) };
        }),
        banner: {
          tone: "info",
          text: "Приёмка запрошена. Отчёт ушёл менеджеру на проверку.",
        },
      })),

    managerPassToClient: (projectId, stageId) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const stage = p.stages.find((s) => s.id === stageId);
          return {
            ...p,
            stages: p.stages.map((s) =>
              s.id === stageId
                ? { ...s, reviewPhase: "client_confirm" as const }
                : s,
            ),
            messages: [
              ...p.messages,
              platformMessage(
                `Этап «${stage?.name}» проверен. Передан клиенту на подтверждение приёмки.`,
              ),
            ],
            activity: [
              ...p.activity,
              logEntry(
                `Менеджер проверил этап «${stage?.name}» и передал клиенту`,
                "platform",
              ),
            ],
          };
        }),
        banner: {
          tone: "info",
          text: "Этап проверен менеджером и передан клиенту на подтверждение.",
        },
      })),

    clientConfirmAcceptance: (projectId, stageId) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const stage = p.stages.find((s) => s.id === stageId);
          return {
            ...p,
            stages: p.stages.map((s) =>
              s.id === stageId
                ? { ...s, reviewPhase: "awaiting_payout" as const }
                : s,
            ),
            activity: [
              ...p.activity,
              logEntry(
                `Клиент подтвердил приёмку этапа «${stage?.name}»`,
                "client",
              ),
            ],
          };
        }),
        banner: {
          tone: "success",
          text: "Приёмка подтверждена. Менеджер инициирует выплату подрядчику из эскроу.",
        },
      })),

    managerPayout: (projectId, stageId) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const stage = p.stages.find((s) => s.id === stageId);
          const updated = {
            ...p,
            stages: p.stages.map((s) =>
              s.id === stageId
                ? {
                    ...s,
                    status: "accepted" as StageStatus,
                    reviewPhase: undefined,
                  }
                : s,
            ),
            messages: [
              ...p.messages,
              platformMessage(
                `Этап «${stage?.name}» принят. Выплата подрядчику проведена из эскроу.`,
              ),
            ],
            activity: [
              ...p.activity,
              logEntry(
                `Менеджер выплатил подрядчику за этап «${stage?.name}» из эскроу`,
                "platform",
              ),
            ],
          };
          return { ...updated, status: recomputeStatus(updated) };
        }),
        banner: {
          tone: "success",
          text: "Этап принят и оплачен. Выплата проведена подрядчику из эскроу.",
        },
      })),

    managerReturnToRework: (projectId, stageId) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const stage = p.stages.find((s) => s.id === stageId);
          const updated = {
            ...p,
            stages: p.stages.map((s) =>
              s.id === stageId
                ? {
                    ...s,
                    status: "rework" as StageStatus,
                    reviewPhase: undefined,
                  }
                : s,
            ),
            messages: [
              ...p.messages,
              platformMessage(
                `Этап «${stage?.name}» возвращён подрядчику на доработку.`,
              ),
            ],
            activity: [
              ...p.activity,
              logEntry(
                `Менеджер вернул этап «${stage?.name}» на доработку`,
                "platform",
              ),
            ],
          };
          return { ...updated, status: recomputeStatus(updated) };
        }),
        banner: {
          tone: "warning",
          text: "Этап возвращён подрядчику на доработку.",
        },
      })),

    managerSetStageStatus: (projectId, stageId, status) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => {
          const stage = p.stages.find((s) => s.id === stageId);
          const updated = {
            ...p,
            stages: p.stages.map((s) =>
              s.id === stageId
                ? {
                    ...s,
                    status,
                    reviewPhase:
                      status === "review"
                        ? s.reviewPhase ?? "manager_check"
                        : undefined,
                  }
                : s,
            ),
            activity: [
              ...p.activity,
              logEntry(
                `Менеджер вручную изменил статус этапа «${stage?.name}»`,
                "platform",
              ),
            ],
          };
          return { ...updated, status: recomputeStatus(updated) };
        }),
      })),

    managerUpdateStage: (projectId, stageId, patch) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => ({
          ...p,
          stages: p.stages.map((s) =>
            s.id === stageId ? { ...s, ...patch } : s,
          ),
        })),
      })),

    managerAddStage: (projectId) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => ({
          ...p,
          stages: [
            ...p.stages,
            {
              id: uid("st"),
              name: "Новый этап",
              status: "needs_payment",
              amount: 0,
              planStart: p.desiredStart,
              planEnd: p.desiredEnd,
              reportFiles: [],
            },
          ],
          activity: [
            ...p.activity,
            logEntry("Менеджер добавил новый этап в таблицу", "platform"),
          ],
        })),
      })),

    managerSetProjectStatus: (projectId, status) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => ({
          ...p,
          status,
          activity: [
            ...p.activity,
            logEntry("Менеджер вручную изменил статус проекта", "platform"),
          ],
        })),
      })),

    managerSetPriority: (projectId, priority) =>
      set((state) => ({
        projects: patchProject(state, projectId, (p) => ({
          ...p,
          priority,
        })),
      })),

    toggleArchive: (projectId) =>
      set((state) => {
        const target = state.projects.find((p) => p.id === projectId);
        return {
          projects: patchProject(state, projectId, (p) => ({
            ...p,
            archived: !p.archived,
          })),
          banner: {
            tone: "info",
            text: target?.archived
              ? "Проект возвращён из архива."
              : "Проект перемещён в архив.",
          },
        };
      }),

    sendMessage: (projectId, text) =>
      set((state) => {
        const role = state.role;
        const authorRole = role === "manager" ? "platform" : role;
        const authorName =
          role === "manager"
            ? PLATFORM_NAME
            : role === "contractor"
              ? CONTRACTORS.find((c) => c.id === CURRENT_CONTRACTOR_ID)!
                  .contactPerson
              : (state.projects
                  .find((p) => p.id === projectId)
                  ?.clientName.split(",")[0] ?? "Клиент");
        return {
          projects: patchProject(state, projectId, (p) => ({
            ...p,
            messages: [
              ...p.messages,
              {
                id: uid("msg"),
                authorRole,
                authorName,
                text,
                time: `сегодня, ${nowTime()}`,
              },
            ],
          })),
        };
      }),
  };
});

export { CONTRACTORS, CURRENT_CONTRACTOR_ID, MANAGER };

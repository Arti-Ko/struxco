// Вычисление визуальных уведомлений: счётчики-бейджи и список «требует внимания».
// Уведомления — только внутри интерфейса (п. 7 ТЗ): без push/e-mail/SMS.

import { CURRENT_CONTRACTOR_ID } from "@/store/seed";
import type { Project, ProjectTab, Role } from "./types";

export interface Notice {
  projectId: string;
  projectName: string;
  text: string;
  tab: ProjectTab;
}

/** Виден ли проект текущему подрядчику (приглашён, подал КП или выбран). */
export function isContractorInvolved(project: Project): boolean {
  return (
    project.contractorId === CURRENT_CONTRACTOR_ID ||
    project.invitedContractorIds.includes(CURRENT_CONTRACTOR_ID) ||
    project.proposals.some((p) => p.contractorId === CURRENT_CONTRACTOR_ID)
  );
}

/** Уведомления по одному проекту для конкретной роли. */
export function projectNotices(project: Project, role: Role): Notice[] {
  const notices: Notice[] = [];
  const add = (text: string, tab: ProjectTab) =>
    notices.push({ projectId: project.id, projectName: project.name, text, tab });

  if (role === "client") {
    const validated = project.proposals.filter((p) => p.validatedByManager);
    if (project.status === "tender" && validated.length > 0) {
      add("Менеджер подобрал подрядчиков — выберите исполнителя", "tender");
    }
    for (const stage of project.stages) {
      if (stage.status === "needs_payment") {
        add(`Этап «${stage.name}» требует оплаты`, "stages");
      }
      if (stage.status === "review" && stage.reviewPhase === "client_confirm") {
        add(`Этап «${stage.name}» — подтвердите приёмку`, "stages");
      }
    }
  }

  if (role === "contractor") {
    const mine = project.proposals.some(
      (p) => p.contractorId === CURRENT_CONTRACTOR_ID,
    );
    if (
      project.status === "tender" &&
      project.invitedContractorIds.includes(CURRENT_CONTRACTOR_ID) &&
      !mine
    ) {
      add("Приглашение в тендер — подайте КП", "tender");
    }
    if (project.contractorId === CURRENT_CONTRACTOR_ID) {
      for (const stage of project.stages) {
        if (stage.status === "paid") {
          add(`Этап «${stage.name}» оплачен — можно начинать работу`, "stages");
        }
        if (stage.status === "rework") {
          add(`Этап «${stage.name}» возвращён на доработку`, "stages");
        }
      }
    }
  }

  if (role === "manager") {
    if (project.status === "draft") {
      add("ТЗ ожидает валидации и открытия тендера", "tender");
    }
    if (project.proposals.some((p) => !p.validatedByManager)) {
      add("Поступило новое КП — проверьте предложение", "tender");
    }
    for (const stage of project.stages) {
      if (stage.status === "review" && stage.reviewPhase === "manager_check") {
        add(`Этап «${stage.name}» — проверьте отчёт подрядчика`, "stages");
      }
      if (stage.status === "review" && stage.reviewPhase === "awaiting_payout") {
        add(`Этап «${stage.name}» — выплатите подрядчику из эскроу`, "stages");
      }
    }
  }

  return notices;
}

/** Все уведомления роли по видимым (не архивным) проектам. */
export function roleNotices(projects: Project[], role: Role): Notice[] {
  return projects
    .filter((p) => !p.archived)
    .filter((p) => role !== "contractor" || isContractorInvolved(p))
    .flatMap((p) => projectNotices(p, role));
}

/** Счётчик действий по проекту для роли (бейдж на карточке проекта). */
export function projectActionCount(project: Project, role: Role): number {
  return projectNotices(project, role).length;
}

/** Счётчик действий для конкретной вкладки карточки проекта. */
export function tabActionCount(
  project: Project,
  role: Role,
  tab: ProjectTab,
): number {
  return projectNotices(project, role).filter((n) => n.tab === tab).length;
}

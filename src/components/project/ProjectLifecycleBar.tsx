"use client";

import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Тонкая горизонтальная шкала жизненного цикла проекта.
 * Видимый порядок фаз: ТЗ → Тендер → Подписание → Этапы → Приёмка → Завершён.
 * «Подписание» — синтетическая фаза между тендером и работами; считаем
 * её активной если выбран `selectedProposalId`, но ещё нет этапов.
 */

type PhaseKey =
  | "draft"
  | "tender"
  | "signing"
  | "in_progress"
  | "review"
  | "done";

interface Phase {
  key: PhaseKey;
  label: string;
}

const PHASES: Phase[] = [
  { key: "draft",       label: "ТЗ" },
  { key: "tender",      label: "Тендер" },
  { key: "signing",     label: "Подписание" },
  { key: "in_progress", label: "Этапы" },
  { key: "review",      label: "Приёмка" },
  { key: "done",        label: "Завершён" },
];

function currentPhase(project: Project): PhaseKey {
  const s: ProjectStatus = project.status;
  if (s === "draft") return "draft";
  if (s === "tender") return "tender";
  if (s === "in_progress") {
    // Этапов ещё нет, но подрядчик выбран → подписание
    if (project.selectedProposalId && project.stages.length === 0)
      return "signing";
    return "in_progress";
  }
  if (s === "review") return "review";
  return "done";
}

export function ProjectLifecycleBar({ project }: { project: Project }) {
  const active = currentPhase(project);
  const activeIdx = PHASES.findIndex((p) => p.key === active);

  return (
    <nav
      aria-label="Жизненный цикл проекта"
      className="flex items-center overflow-x-auto rounded-lg"
      style={{
        background: "#141416",
        border: "1px solid #26262a",
      }}
    >
      {PHASES.map((phase, idx) => {
        const state =
          idx < activeIdx ? "done" : idx === activeIdx ? "active" : "future";
        return (
          <div
            key={phase.key}
            className={cn(
              "flex flex-1 items-center gap-2 px-4 py-2.5 text-xs whitespace-nowrap",
              idx > 0 && "border-l",
            )}
            style={{
              borderColor: "#26262a",
              color:
                state === "active"
                  ? "#ededed"
                  : state === "done"
                    ? "#a1a1aa"
                    : "#7d7d80",
              background:
                state === "active" ? "#1c1c1f" : "transparent",
            }}
          >
            <span
              className="grid size-4 place-items-center rounded-full text-[10px] font-bold"
              style={{
                background:
                  state === "done"
                    ? "#34d399"
                    : state === "active"
                      ? "#ededed"
                      : "#26262a",
                color:
                  state === "done"
                    ? "#052e1c"
                    : state === "active"
                      ? "#0a0a0c"
                      : "#7d7d80",
              }}
              aria-hidden
            >
              {state === "done" ? "✓" : idx + 1}
            </span>
            <span
              className={cn(
                "font-medium",
                state === "active" && "tracking-tight",
              )}
            >
              {phase.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}

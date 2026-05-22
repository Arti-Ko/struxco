"use client";

// Административный дашборд менеджера: таблица всех проектов с фильтром (п. 6 ТЗ).

import { useState } from "react";
import { AlertCircle, FileCheck2, LayoutGrid } from "lucide-react";
import { PageHeading } from "@/components/shared/PageHeading";
import { StatCard } from "@/components/shared/StatCard";
import { PriorityBadge, StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatBudgetRange, formatMoney } from "@/lib/format";
import { projectActionCount } from "@/lib/notifications";
import type { Priority, Project, ProjectStatus } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const PRIORITY_RANK: Record<Priority, number> = { low: 0, medium: 1, high: 2 };

type Filter = "all" | ProjectStatus | "archive";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "draft", label: "Черновик" },
  { id: "tender", label: "Тендер" },
  { id: "in_progress", label: "В работе" },
  { id: "review", label: "На приёмке" },
  { id: "done", label: "Завершённые" },
  { id: "archive", label: "Архив" },
];

export function ManagerDashboard() {
  const projects = useAppStore((s) => s.projects);
  const role = useAppStore((s) => s.role);
  const openProject = useAppStore((s) => s.openProject);

  const [filter, setFilter] = useState<Filter>("all");

  const filtered = projects.filter((p) => {
    if (filter === "all") return !p.archived;
    if (filter === "archive") return p.archived;
    return !p.archived && p.status === filter;
  });

  // Sort: archived last, then by priority desc, then by notice count desc.
  const sorted = [...filtered].sort((a, b) => {
    const pa = PRIORITY_RANK[a.priority];
    const pb = PRIORITY_RANK[b.priority];
    if (pa !== pb) return pb - pa;
    const na = projectActionCount(a, role);
    const nb = projectActionCount(b, role);
    return nb - na;
  });

  const needsAction = projects.filter(
    (p) => !p.archived && projectActionCount(p, role) > 0,
  ).length;
  const inTender = projects.filter((p) => !p.archived && p.status === "tender").length;
  const inProgress = projects.filter(
    (p) => !p.archived && ["in_progress", "review"].includes(p.status),
  ).length;

  return (
    <div className="space-y-7">
      <PageHeading
        title="Все проекты"
        subtitle="Управление проектами, КП и приёмками"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={AlertCircle}
          label="Требуют действий"
          value={needsAction}
          hint="Проектов с задачами"
          color="#f59e0b"
        />
        <StatCard
          icon={LayoutGrid}
          label="В тендере"
          value={inTender}
          hint="Идёт сбор КП"
          color="#a1a1aa"
        />
        <StatCard
          icon={FileCheck2}
          label="В работе / Приёмка"
          value={inProgress}
          hint="Активных контрактов"
          color="#10b981"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const count =
            f.id === "all"
              ? projects.filter((p) => !p.archived).length
              : f.id === "archive"
                ? projects.filter((p) => p.archived).length
                : projects.filter((p) => !p.archived && p.status === f.id)
                    .length;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-8 rounded-full px-3.5 text-xs font-semibold transition-colors",
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {f.label}
              {count > 0 && (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                    filter === f.id
                      ? "bg-white/20"
                      : "bg-foreground/10",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Проектов нет"
          description="Проекты в этом статусе не найдены."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-3 py-3">Проект</th>
                  <th className="px-3 py-3">Клиент</th>
                  <th className="px-3 py-3">Исполнитель</th>
                  <th className="px-3 py-3">Статус</th>
                  <th className="px-3 py-3">Приоритет</th>
                  <th className="px-5 py-3 text-right">Бюджет / смета</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((project) => {
                  const actions = projectActionCount(project, role);
                  const smeta = project.stages.reduce(
                    (s, st) => s + st.amount,
                    0,
                  );
                  return (
                    <tr
                      key={project.id}
                      onClick={() => openProject(project.id)}
                      className="cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/40"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {project.code}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 max-w-[260px]">
                        <p className="truncate font-medium">{project.name}</p>
                        {actions > 0 && (
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#fbbf24]">
                            <span className="size-1.5 rounded-full bg-[#f59e0b]" />
                            {actions} действ.
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-muted-foreground">
                        <span className="truncate max-w-[140px] block">
                          {project.clientName.split(",")[0]}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-muted-foreground">
                        {project.contractorName ?? (
                          <span className="text-muted-foreground/60">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge status={project.status} size="sm" />
                      </td>
                      <td className="px-3 py-3.5">
                        <PriorityBadge priority={project.priority} />
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                        {smeta > 0
                          ? formatMoney(smeta)
                          : formatBudgetRange(
                              project.budgetFrom,
                              project.budgetTo,
                            )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

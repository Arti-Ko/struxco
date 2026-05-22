"use client";

// Шапка карточки проекта для клиента и подрядчика: название, статус крупно,
// кнопка «Архивировать» (п. 5.2 ТЗ).

import { ArchiveRestore, Archive, ArrowLeft, CalendarRange } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { Project, Role } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

interface ProjectHeaderProps {
  project: Project;
  role: Role;
}

export function ProjectHeader({ project, role }: ProjectHeaderProps) {
  const goToDashboard = useAppStore((s) => s.goToDashboard);
  const toggleArchive = useAppStore((s) => s.toggleArchive);

  const showArchive =
    role === "client" && (project.status === "done" || project.archived);

  return (
    <div>
      <button
        type="button"
        onClick={goToDashboard}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {role === "manager" ? "Все проекты" : "Мои проекты"}
      </button>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground">
              {project.code}
            </span>
            <StatusBadge status={project.status} size="lg" />
            {project.archived && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                <Archive className="size-3" />в архиве
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight lg:text-[1.75rem]">
            {project.name}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarRange className="size-4" />
              {formatDate(project.desiredStart)} —{" "}
              {formatDate(project.desiredEnd)}
            </span>
            {project.contractorName && (
              <span>
                Исполнитель:{" "}
                <span className="font-medium text-foreground">
                  {project.contractorName}
                </span>
              </span>
            )}
          </p>
        </div>

        {showArchive && (
          <Button
            variant="outline"
            className="h-10"
            onClick={() => toggleArchive(project.id)}
          >
            {project.archived ? (
              <>
                <ArchiveRestore className="size-4" />
                Вернуть из архива
              </>
            ) : (
              <>
                <Archive className="size-4" />
                Архивировать
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";

// Дашборд клиента: сводка, сетка проектов, кнопка создания ТЗ (п. 5.1 ТЗ).

import { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  CheckCircle2,
  FolderPlus,
  LayoutGrid,
  Lock,
  Wallet,
} from "lucide-react";
import { PageHeading } from "@/components/shared/PageHeading";
import { StatCard } from "@/components/shared/StatCard";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { useAppStore } from "@/store/useAppStore";

export function ClientDashboard() {
  const projects = useAppStore((s) => s.projects);
  const role = useAppStore((s) => s.role);
  const goToCreate = useAppStore((s) => s.goToCreate);
  const openProject = useAppStore((s) => s.openProject);
  const [showArchived, setShowArchived] = useState(false);

  const active = projects.filter(
    (p) => !p.archived && p.status !== "done",
  );
  const done = projects.filter((p) => p.status === "done");
  const archived = projects.filter((p) => p.archived);

  const inEscrow = projects
    .filter((p) => !p.archived)
    .reduce(
      (sum, p) =>
        sum +
        p.stages
          .filter((s) => ["paid", "in_progress", "review"].includes(s.status))
          .reduce((a, s) => a + s.amount, 0),
      0,
    );

  const visible = showArchived
    ? projects
    : projects.filter((p) => !p.archived);

  return (
    <div className="space-y-8">
      <PageHeading
        title="Мои проекты"
        subtitle="Личный кабинет заказчика"
        action={
          <Button
            className="h-10"
            style={{ background: "#fafafa", color: "#0a0a0c", borderRadius: "6px", boxShadow: "0 1px 0 rgba(255,255,255,0.15) inset, 0 1px 2px rgba(0,0,0,0.5)" }}
            onClick={goToCreate}
          >
            <FolderPlus className="size-4" />
            Создать проект
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={LayoutGrid}
          label="Активных проектов"
          value={active.length}
          hint="В работе и тендере"
          color="#a1a1aa"
        />
        <StatCard
          icon={Lock}
          label="В эскроу"
          value={formatMoney(inEscrow)}
          hint="Зарезервировано на платформе"
          color="#fbbf24"
        />
        <StatCard
          icon={CheckCircle2}
          label="Завершено"
          value={done.length}
          hint="Принятых проектов"
          color="#34d399"
        />
      </div>

      {/* Archive toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">
          {showArchived
            ? `Все проекты (${projects.length})`
            : `Активные (${active.length + done.length})`}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowArchived((v) => !v)}
          className="h-8 text-xs"
        >
          {showArchived ? (
            <>
              <ArchiveRestore className="size-3.5" />
              Скрыть архив
            </>
          ) : (
            <>
              <Archive className="size-3.5" />
              Архивные ({archived.length})
            </>
          )}
        </Button>
      </div>

      {/* Project cards */}
      {visible.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="Проектов пока нет"
          description="Создайте первый проект — опишите задачу, загрузите ТЗ, и менеджер откроет тендер среди проверенных подрядчиков."
          action={
            <Button
              className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={goToCreate}
            >
              <FolderPlus className="size-4" />
              Создать первый проект
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              role={role}
              onOpen={() => openProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

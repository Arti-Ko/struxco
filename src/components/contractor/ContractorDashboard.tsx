"use client";

// Дашборд подрядчика: приглашения в тендеры + текущие проекты (п. 5.3 ТЗ).

import { Gavel, HardHat, LayoutGrid } from "lucide-react";
import { PageHeading } from "@/components/shared/PageHeading";
import { StatCard } from "@/components/shared/StatCard";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { isContractorInvolved } from "@/lib/notifications";
import { CURRENT_CONTRACTOR_ID } from "@/store/seed";
import { useAppStore } from "@/store/useAppStore";

export function ContractorDashboard() {
  const projects = useAppStore((s) => s.projects);
  const role = useAppStore((s) => s.role);
  const openProject = useAppStore((s) => s.openProject);

  const visible = projects.filter((p) => isContractorInvolved(p) && !p.archived);

  // Тендеры, где подрядчик приглашён, но КП ещё не подан.
  const invitations = visible.filter(
    (p) =>
      p.status === "tender" &&
      p.invitedContractorIds.includes(CURRENT_CONTRACTOR_ID) &&
      !p.proposals.some((pr) => pr.contractorId === CURRENT_CONTRACTOR_ID),
  );

  // Активные проекты (в работе / на приёмке / завершённые).
  const myProjects = visible.filter(
    (p) => p.contractorId === CURRENT_CONTRACTOR_ID,
  );

  // В тендере, уже подал КП.
  const submitted = visible.filter(
    (p) =>
      p.status === "tender" &&
      p.proposals.some((pr) => pr.contractorId === CURRENT_CONTRACTOR_ID),
  );

  return (
    <div className="space-y-8">
      <PageHeading
        title="Мои заказы"
        subtitle="Тендеры, в которые вы приглашены, и текущие проекты"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Gavel}
          label="Новых приглашений"
          value={invitations.length}
          hint="Требуют подачи КП"
          color="#fbbf24"
        />
        <StatCard
          icon={HardHat}
          label="В работе"
          value={myProjects.filter((p) => p.status === "in_progress" || p.status === "review").length}
          hint="Активных контрактов"
          color="#a1a1aa"
        />
        <StatCard
          icon={LayoutGrid}
          label="Завершено"
          value={myProjects.filter((p) => p.status === "done").length}
          hint="Принятых проектов"
          color="#34d399"
        />
      </div>

      {/* Invitations */}
      <section>
        <h2 className="mb-4 text-base font-semibold">
          Новые приглашения в тендеры
          {invitations.length > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-[#fbbf24]/12 px-2 py-0.5 text-xs font-bold text-[#fbbf24]">
              {invitations.length}
            </span>
          )}
        </h2>
        {invitations.length === 0 ? (
          <EmptyState
            icon={Gavel}
            title="Новых приглашений нет"
            description="Когда менеджер платформы включит вас в тендер, приглашение появится здесь."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {invitations.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                role={role}
                onOpen={() => openProject(project.id, "tender")}
              />
            ))}
          </div>
        )}
      </section>

      {/* Submitted КП, awaiting decision */}
      {submitted.length > 0 && (
        <section>
          <h2 className="mb-4 text-base font-semibold text-muted-foreground">
            КП отправлено — ждём решения клиента
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {submitted.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                role={role}
                onOpen={() => openProject(project.id, "tender")}
              />
            ))}
          </div>
        </section>
      )}

      {/* Active + done */}
      <section>
        <h2 className="mb-4 text-base font-semibold">Мои проекты</h2>
        {myProjects.length === 0 ? (
          <EmptyState
            icon={HardHat}
            title="Контрактов пока нет"
            description="После того как клиент выберет ваше КП, проект появится здесь."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {myProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                role={role}
                onOpen={() => openProject(project.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

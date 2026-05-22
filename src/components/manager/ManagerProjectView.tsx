"use client";

// Полное представление проекта для менеджера — conversation-first.
// Лента событий + sticky-сайдбар + блоки админ-инструментов под лентой.

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Banner } from "@/components/shared/Banner";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectLifecycleBar } from "@/components/project/ProjectLifecycleBar";
import { ProjectSidebar } from "@/components/project/ProjectSidebar";
import { ProjectFeed } from "@/components/project/feed/ProjectFeed";
import { FeedFilterBar } from "@/components/project/feed/FeedFilterBar";
import { FeedComposer } from "@/components/project/feed/FeedComposer";
import { TzPanel } from "@/components/manager/TzPanel";
import { ParticipantsPanel } from "@/components/manager/ParticipantsPanel";
import { StageManager } from "@/components/manager/StageManager";
import type { FeedFilter } from "@/lib/projectFeed";
import type { Project } from "@/lib/types";

interface ManagerProjectViewProps {
  project: Project;
}

/**
 * Менеджерский view проекта в conversation-first парадигме: лента как
 * основной интерфейс, а специфические для менеджера инструменты (правка ТЗ,
 * управление участниками, ручное управление этапами) живут блоками ниже
 * с заголовками — без табов, всё на одной странице.
 */
export function ManagerProjectView({ project }: ManagerProjectViewProps) {
  const [filter, setFilter] = useState<FeedFilter>("all");
  const banner = useAppStore((s) => s.banner);
  const dismissBanner = useAppStore((s) => s.dismissBanner);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const managerValidateProposal = useAppStore((s) => s.managerValidateProposal);
  const managerPassToClient = useAppStore((s) => s.managerPassToClient);
  const managerPayout = useAppStore((s) => s.managerPayout);
  const managerReturnToRework = useAppStore((s) => s.managerReturnToRework);

  return (
    <div className="space-y-5">
      <ProjectHeader project={project} role="manager" />

      {banner && <Banner banner={banner} onDismiss={dismissBanner} />}

      <ProjectLifecycleBar project={project} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <div className="space-y-4">
            <FeedFilterBar value={filter} onChange={setFilter} />
            <ProjectFeed
              project={project}
              viewerRole="manager"
              filter={filter}
              actions={{
                onValidateProposal: (proposalId) =>
                  managerValidateProposal(project.id, proposalId),
                onPassToClient: (stageId) =>
                  managerPassToClient(project.id, stageId),
                onPayout: (stageId) => managerPayout(project.id, stageId),
                onReturnToRework: (stageId) =>
                  managerReturnToRework(project.id, stageId),
              }}
              footer={
                <FeedComposer
                  onSend={(text) => sendMessage(project.id, text)}
                />
              }
            />
          </div>

          {/* Админ-инструменты: ниже ленты, не доминируют, но всегда под рукой */}
          <section className="space-y-4">
            <h2 className="eyebrow">Инструменты менеджера</h2>
            <TzPanel project={project} />
            {project.status !== "draft" && (
              <ParticipantsPanel project={project} />
            )}
            {project.stages.length > 0 && <StageManager project={project} />}
          </section>
        </div>
        <ProjectSidebar project={project} />
      </div>
    </div>
  );
}

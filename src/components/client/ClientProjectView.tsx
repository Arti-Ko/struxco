"use client";

// Полное представление проекта для клиента — conversation-first:
// единая лента событий проекта + sticky-сайдбар с метаданными.

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Banner } from "@/components/shared/Banner";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectLifecycleBar } from "@/components/project/ProjectLifecycleBar";
import { ProjectSidebar } from "@/components/project/ProjectSidebar";
import { ProjectFeed } from "@/components/project/feed/ProjectFeed";
import { FeedFilterBar } from "@/components/project/feed/FeedFilterBar";
import { FeedComposer } from "@/components/project/feed/FeedComposer";
import type { FeedFilter } from "@/lib/projectFeed";
import type { Project } from "@/lib/types";

interface ClientProjectViewProps {
  project: Project;
}

export function ClientProjectView({ project }: ClientProjectViewProps) {
  const [filter, setFilter] = useState<FeedFilter>("all");
  const banner = useAppStore((s) => s.banner);
  const dismissBanner = useAppStore((s) => s.dismissBanner);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const clientSelectProposal = useAppStore((s) => s.clientSelectProposal);
  const clientConfirmAcceptance = useAppStore(
    (s) => s.clientConfirmAcceptance,
  );

  return (
    <div className="space-y-5">
      <ProjectHeader project={project} role="client" />

      {banner && <Banner banner={banner} onDismiss={dismissBanner} />}

      <ProjectLifecycleBar project={project} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <FeedFilterBar value={filter} onChange={setFilter} />
          <ProjectFeed
            project={project}
            viewerRole="client"
            filter={filter}
            actions={{
              onSelectProposal: (proposalId) =>
                clientSelectProposal(project.id, proposalId),
              onConfirmAcceptance: (stageId) =>
                clientConfirmAcceptance(project.id, stageId),
            }}
            footer={
              <FeedComposer
                onSend={(text) => sendMessage(project.id, text)}
              />
            }
          />
        </div>
        <ProjectSidebar project={project} />
      </div>
    </div>
  );
}

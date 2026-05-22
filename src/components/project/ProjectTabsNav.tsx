"use client";

// Горизонтальные табы карточки проекта (п. 5.2 ТЗ): Тендер, Этапы,
// Коммуникация, Документы. Со счётчиками-бейджами действий.

import { FolderClosed, Gavel, ListChecks, MessagesSquare } from "lucide-react";
import { tabActionCount } from "@/lib/notifications";
import type { Project, ProjectTab, Role } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TabDef {
  id: ProjectTab;
  label: string;
  icon: typeof Gavel;
}

const ALL_TABS: TabDef[] = [
  { id: "tender", label: "Тендер", icon: Gavel },
  { id: "stages", label: "Этапы", icon: ListChecks },
  { id: "chat", label: "Коммуникация", icon: MessagesSquare },
  { id: "documents", label: "Документы", icon: FolderClosed },
];

interface ProjectTabsNavProps {
  project: Project;
  role: Role;
  active: ProjectTab;
  onChange: (tab: ProjectTab) => void;
}

export function ProjectTabsNav({
  project,
  role,
  active,
  onChange,
}: ProjectTabsNavProps) {
  // Вкладка «Тендер» видна только при статусе «Тендер».
  const tabs = ALL_TABS.filter(
    (t) => t.id !== "tender" || project.status === "tender",
  );

  return (
    <div
      role="tablist"
      className="flex gap-1 overflow-x-auto border-b"
      aria-label="Разделы проекта"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const badge = tabActionCount(project, role, tab.id);
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "text-[#a1a1aa]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {tab.label}
            {badge > 0 && (
              <span
                className={cn(
                  "grid min-h-4.5 min-w-4.5 place-items-center rounded-full px-1 text-[10px] font-bold",
                  isActive
                    ? "bg-[#fafafa] text-white"
                    : "bg-[#fbbf24] text-[#0b1520]",
                )}
              >
                {badge}
              </span>
            )}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#fafafa]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

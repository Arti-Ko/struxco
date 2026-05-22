// История действий проекта — лог смен статусов, оплат и редактирований.

import { History } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { EmptyState } from "@/components/shared/EmptyState";
import type { ActivityEntry } from "@/lib/types";

const ACTOR_COLOR: Record<ActivityEntry["actor"], string> = {
  client:     "#fafafa",
  contractor: "#fbbf24",
  platform:   "#34d399",
  system:     "#94a3b8",
  manager:    "#34d399",
};

interface ActivityLogProps {
  entries: ActivityEntry[];
  /** Заголовок панели; по умолчанию — «История действий». */
  title?: string;
}

export function ActivityLog({
  entries,
  title = "История действий",
}: ActivityLogProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Событий пока нет"
        description="Здесь появятся все изменения статусов, оплаты и редактирования."
      />
    );
  }

  // Свежие события — сверху.
  const ordered = [...entries].reverse();

  return (
    <Panel icon={History} title={title}>
      <ol className="relative space-y-4 before:absolute before:top-1 before:bottom-1 before:left-[5px] before:w-px before:bg-border">
        {ordered.map((entry) => (
          <li key={entry.id} className="relative pl-6">
            <span
              className="absolute top-1 left-0 size-3 rounded-full ring-4 ring-card"
              style={{ backgroundColor: ACTOR_COLOR[entry.actor] }}
              aria-hidden
            />
            <p className="text-sm">{entry.text}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{entry.time}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

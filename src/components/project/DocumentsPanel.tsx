// Вкладка «Документы» (п. 5.2 ТЗ): список всех файлов проекта + история действий.

import { Download, FileText, FolderClosed } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/format";
import { tint } from "@/lib/statuses";
import type { FileKind, Project } from "@/lib/types";
import { ActivityLog } from "./ActivityLog";

const KIND_META: Record<FileKind, { label: string; color: string }> = {
  tz:       { label: "ТЗ",      color: "#a1a1aa" },
  kp:       { label: "КП",      color: "#fbbf24" },
  report:   { label: "Отчёт",   color: "#34d399" },
  contract: { label: "Договор", color: "#c084fc" },
  other:    { label: "Файл",    color: "#94a3b8" },
};

export function DocumentsPanel({ project }: { project: Project }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Panel
        icon={FolderClosed}
        title="Документы проекта"
        description="ТЗ, коммерческие предложения, отчёты и договоры"
        flush
      >
        {project.files.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={FileText}
              title="Файлов пока нет"
              description="Документы появятся по мере работы над проектом."
            />
          </div>
        ) : (
          <ul className="divide-y">
            {project.files.map((file) => {
              const meta = KIND_META[file.kind];
              return (
                <li
                  key={file.id}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-lg"
                    style={{
                      backgroundColor: tint(meta.color, 0.12),
                      color: meta.color,
                    }}
                  >
                    <FileText className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>
                      <span
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{
                          backgroundColor: tint(meta.color, 0.14),
                          color: meta.color,
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {file.uploadedBy} · {formatDate(file.date)} · {file.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Скачать ${file.name}`}
                    className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <Download className="size-4.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <ActivityLog entries={project.activity} />
    </div>
  );
}

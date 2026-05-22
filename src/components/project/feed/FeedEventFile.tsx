import { Download, FileText } from "lucide-react";
import type { FileUploadedEvent } from "@/lib/projectFeed";
import type { FileKind } from "@/lib/types";

interface Props {
  event: FileUploadedEvent;
}

const KIND_META: Record<FileKind, { label: string; color: string }> = {
  tz:       { label: "ТЗ",      color: "#a1a1aa" },
  kp:       { label: "КП",      color: "#fbbf24" },
  report:   { label: "Отчёт",   color: "#34d399" },
  contract: { label: "Договор", color: "#c084fc" },
  other:    { label: "Файл",    color: "#94a3b8" },
};

/**
 * Событие «загружен файл» — компактная карточка с иконкой и кнопкой
 * скачивания. Цвет тега соответствует виду файла (ТЗ / КП / Отчёт / Договор).
 */
export function FeedEventFile({ event }: Props) {
  const meta = KIND_META[event.file.kind];

  return (
    <article
      className="flex items-center gap-3 rounded-lg p-3"
      style={{
        background: "#141416",
        border: "1px solid #26262a",
      }}
    >
      <span
        className="grid size-9 shrink-0 place-items-center rounded-md"
        style={{
          background: `${meta.color}1a`,
          color: meta.color,
          boxShadow: `inset 0 0 0 1px ${meta.color}33`,
        }}
        aria-hidden
      >
        <FileText className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: `${meta.color}1a`,
              color: meta.color,
            }}
          >
            {meta.label}
          </span>
          <span className="truncate font-medium" style={{ color: "#ededed" }}>
            {event.file.name}
          </span>
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: "#7d7d80" }}>
          {event.file.uploadedBy} · {event.file.size} · {event.atLabel}
        </p>
      </div>
      <button
        type="button"
        aria-label="Скачать"
        className="grid size-8 shrink-0 place-items-center rounded-md transition"
        style={{
          color: "#7d7d80",
          border: "1px solid #26262a",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#ededed";
          e.currentTarget.style.borderColor = "#3a3a3f";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#7d7d80";
          e.currentTarget.style.borderColor = "#26262a";
        }}
      >
        <Download className="size-4" />
      </button>
    </article>
  );
}

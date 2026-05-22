"use client";

import type { FeedFilter } from "@/lib/projectFeed";
import { cn } from "@/lib/utils";

const OPTIONS: Array<{ value: FeedFilter; label: string }> = [
  { value: "all",        label: "Все события" },
  { value: "discussion", label: "Обсуждения" },
  { value: "files",      label: "Файлы" },
  { value: "stages",     label: "Этапы" },
  { value: "escrow",     label: "Эскроу" },
];

interface FeedFilterBarProps {
  value: FeedFilter;
  onChange: (next: FeedFilter) => void;
}

/**
 * Тонкая полоса-переключатель фильтра ленты — типа табов, но без переходов:
 * меняет только видимый срез событий в `ProjectFeed`.
 */
export function FeedFilterBar({ value, onChange }: FeedFilterBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Фильтр ленты проекта"
      className="flex items-center gap-1 rounded-lg p-1"
      style={{
        background: "#141416",
        border: "1px solid #26262a",
      }}
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition",
            )}
            style={
              active
                ? {
                    background: "#1c1c1f",
                    color: "#ededed",
                    boxShadow: "inset 0 0 0 1px #3a3a3f",
                  }
                : { color: "#7d7d80", background: "transparent" }
            }
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = "#ededed";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = "#7d7d80";
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

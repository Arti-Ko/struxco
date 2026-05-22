// Цветные статусные бейджи. Цвета — строго из палитры ТЗ (п. 4.2, 8).

import {
  PRIORITY,
  PROJECT_STATUS,
  STAGE_STATUS,
  tint,
} from "@/lib/statuses";
import type { Priority, ProjectStatus, StageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type PillSize = "sm" | "md" | "lg";

interface PillProps {
  color: string;
  label: string;
  size?: PillSize;
  className?: string;
}

const SIZES: Record<PillSize, string> = {
  sm: "h-5 gap-1.5 px-2 text-[11px]",
  md: "h-6 gap-1.5 px-2.5 text-xs",
  lg: "h-7 gap-2 px-3 text-sm",
};

/**
 * Base pill for dark theme:
 * - tint(color, 0.12) background
 * - raw color text
 * - inset border 1px tint(color, 0.25)
 * - dot indicator before label
 */
function Pill({ color, label, size = "md", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center rounded-full font-semibold whitespace-nowrap",
        SIZES[size],
        className,
      )}
      style={{
        backgroundColor: tint(color, 0.12),
        color,
        boxShadow: `inset 0 0 0 1px ${tint(color, 0.25)}`,
      }}
    >
      <span
        className="size-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  );
}

export function StatusBadge({
  status,
  size,
}: {
  status: ProjectStatus;
  size?: PillSize;
}) {
  const cfg = PROJECT_STATUS[status];
  return <Pill color={cfg.color} label={cfg.label} size={size} />;
}

export function StageStatusBadge({
  status,
  size,
}: {
  status: StageStatus;
  size?: PillSize;
}) {
  const cfg = STAGE_STATUS[status];
  return <Pill color={cfg.color} label={cfg.label} size={size} />;
}

export function PriorityBadge({
  priority,
  size,
}: {
  priority: Priority;
  size?: PillSize;
}) {
  const cfg = PRIORITY[priority];
  return <Pill color={cfg.color} label={cfg.label} size={size} />;
}

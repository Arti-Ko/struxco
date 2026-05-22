import type { LucideIcon } from "lucide-react";
import { tint } from "@/lib/statuses";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  color?: string;
}

export function StatCard({ icon: Icon, label, value, hint, color = "#fafafa" }: StatCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-6"
      style={{
        backgroundColor: "#141416",
        border: "1px solid #26262a",
      }}
    >
      {/* Icon + eyebrow label */}
      <div className="flex items-center gap-2.5 mb-5">
        <span
          className="grid size-8 shrink-0 place-items-center rounded-lg"
          style={{
            background: tint(color, 0.12),
            color,
            border: `1px solid ${tint(color, 0.22)}`,
          }}
        >
          <Icon className="size-4" />
        </span>
        <p className="eyebrow">{label}</p>
      </div>

      {/* Big number — tight like Linear display-xl */}
      <p
        className="text-[2.5rem] font-bold leading-none"
        style={{ color: "#ededed", letterSpacing: "-0.04em" }}
      >
        {value}
      </p>

      {hint && (
        <p className="mt-2 text-sm" style={{ color: "#7d7d80" }}>
          {hint}
        </p>
      )}

      {/* Thin color accent line at bottom — gradient to transparent */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-1/2"
        style={{ background: `linear-gradient(90deg, ${color}99, transparent)` }}
        aria-hidden
      />
    </div>
  );
}

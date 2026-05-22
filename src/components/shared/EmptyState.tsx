import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-6 py-14 text-center"
      style={{
        border: "1px dashed #26262a",
        background: "rgba(10,10,12,0.5)",
      }}
    >
      <span
        className="grid size-12 place-items-center rounded-xl"
        style={{
          background: "#1c1c1f",
          color: "#a1a1aa",
          border: "1px solid #26262a",
        }}
      >
        <Icon className="size-6" />
      </span>

      <p
        className="mt-4 text-base font-semibold"
        style={{ color: "#ededed", letterSpacing: "-0.01em" }}
      >
        {title}
      </p>

      {description && (
        <p
          className="mt-1.5 max-w-sm text-sm leading-relaxed"
          style={{ color: "#7d7d80" }}
        >
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

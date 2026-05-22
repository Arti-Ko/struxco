import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PanelProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
}

export function Panel({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
  flush = false,
}: PanelProps) {
  return (
    <section
      className={cn("overflow-hidden rounded-xl", className)}
      style={{ backgroundColor: "#141416", border: "1px solid #26262a" }}
    >
      <header
        className="flex items-center justify-between gap-4 px-5 py-3.5"
        style={{ borderBottom: "1px solid #26262a" }}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <span
              className="grid size-8 shrink-0 place-items-center rounded-lg"
              style={{
                background: "#1c1c1f",
                color: "#a1a1aa",
                border: "1px solid #26262a",
              }}
            >
              <Icon className="size-4" />
            </span>
          )}
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: "#ededed", letterSpacing: "-0.01em" }}
            >
              {title}
            </h2>
            {description && (
              <p className="text-xs" style={{ color: "#7d7d80" }}>
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className={cn(flush ? "" : "p-5")}>{children}</div>
    </section>
  );
}

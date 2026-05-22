import { ArrowRight, CalendarRange, HardHat, Wallet } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatBudgetRange, formatDate, formatMoney } from "@/lib/format";
import { projectActionCount } from "@/lib/notifications";
import { PROJECT_STATUS } from "@/lib/statuses";
import type { Project, Role } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  role: Role;
  onOpen: () => void;
}

export function ProjectCard({ project, role, onOpen }: ProjectCardProps) {
  const statusColor = PROJECT_STATUS[project.status].color;
  const actions = projectActionCount(project, role);

  const hasStages = project.stages.length > 0;
  const acceptedCount = project.stages.filter((s) => s.status === "accepted").length;
  const stagesTotal = project.stages.reduce((sum, s) => sum + s.amount, 0);

  const contractorLabel = project.contractorName
    ? project.contractorName
    : project.status === "tender" ? "Идёт подбор" : "Будет назначен";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); }
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fafafa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c]"
      style={{ backgroundColor: "#141416", border: "1px solid #26262a" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#1c1c1f";
        e.currentTarget.style.borderColor = "#3a3a3f";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#141416";
        e.currentTarget.style.borderColor = "#26262a";
      }}
    >
      {/* Status stripe — 2px with directional glow */}
      <div
        className="h-[2px] w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, ${statusColor} 0%, ${statusColor}40 60%, transparent 100%)`,
        }}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Code eyebrow + status badge */}
        <div className="flex items-center justify-between gap-3">
          <span
            className="eyebrow"
            style={{ color: statusColor, opacity: 0.85 }}
          >
            {project.code}
          </span>
          <StatusBadge status={project.status} size="sm" />
        </div>

        {/* Title */}
        <h3
          className="mt-3 text-[15px] font-semibold leading-snug"
          style={{ color: "#ededed", letterSpacing: "-0.02em" }}
        >
          {project.name}
        </h3>
        <p
          className="mt-1.5 line-clamp-2 text-sm leading-relaxed"
          style={{ color: "#7d7d80" }}
        >
          {project.description}
        </p>

        {/* Meta grid */}
        <div
          className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 pt-4"
          style={{ borderTop: "1px solid #26262a" }}
        >
          <Meta
            icon={Wallet}
            label={hasStages ? "Смета" : "Бюджет"}
            value={hasStages ? formatMoney(stagesTotal) : formatBudgetRange(project.budgetFrom, project.budgetTo)}
          />
          <Meta
            icon={HardHat}
            label="Исполнитель"
            value={contractorLabel}
            muted={!project.contractorName}
          />
          <Meta
            icon={CalendarRange}
            label="Сроки"
            value={`${formatDate(project.desiredStart)} — ${formatDate(project.desiredEnd)}`}
            wide
          />
        </div>

        {/* Progress bar */}
        {hasStages && (
          <div className="mt-4">
            <div className="flex justify-between mb-1.5">
              <span className="eyebrow">Этапы приняты</span>
              <span
                className="text-xs font-semibold"
                style={{ color: "#34d399" }}
              >
                {acceptedCount} / {project.stages.length}
              </span>
            </div>
            <div
              className="h-[2px] overflow-hidden rounded-full"
              style={{ background: "#26262a" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(acceptedCount / project.stages.length) * 100}%`,
                  background: "linear-gradient(90deg, #34d399, #10b981)",
                }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-5 flex items-center justify-between gap-3 pt-4"
          style={{ borderTop: "1px solid #26262a" }}
        >
          {actions > 0 ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] uppercase"
              style={{
                background: "rgba(251,191,36,0.1)",
                color: "#fbbf24",
                border: "1px solid rgba(251,191,36,0.2)",
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: "#fbbf24" }}
              />
              {actions} действ.
            </span>
          ) : (
            <span />
          )}
          <span
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "#fafafa" }}
          >
            Перейти в проект
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
  muted = false,
  wide = false,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  muted?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <p className="eyebrow flex items-center gap-1.5">
        <Icon className="size-3" />
        {label}
      </p>
      <p
        className="mt-0.5 text-sm font-semibold"
        style={{ color: muted ? "#7d7d80" : "#ededed" }}
      >
        {value}
      </p>
    </div>
  );
}

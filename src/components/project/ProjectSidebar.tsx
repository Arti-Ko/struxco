"use client";

import { FileText, Layers, Lock, ShieldCheck, User } from "lucide-react";
import type { Project } from "@/lib/types";
import { formatBudgetRange, formatDateRange, formatMoney } from "@/lib/format";

/**
 * Sticky-сайдбар проекта: ключевые метаданные и компактные виджеты
 * (бюджет, исполнитель, сроки, эскроу, документы). Это «карточка проекта»
 * рядом с лентой событий — нужна, чтобы не возвращаться в табы.
 */

interface SectionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, label, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="flex items-center gap-1.5"
        style={{ color: "#7d7d80" }}
      >
        <Icon className="size-3 shrink-0" />
        <span className="eyebrow">{label}</span>
      </div>
      <div className="text-sm" style={{ color: "#ededed" }}>
        {children}
      </div>
    </div>
  );
}

export function ProjectSidebar({ project }: { project: Project }) {
  // Эскроу: сумма стадий в paid + review (заморожено) vs accepted (выплачено)
  const reserved = project.stages
    .filter((s) => s.status === "paid" || s.status === "review")
    .reduce((sum, s) => sum + s.amount, 0);
  const released = project.stages
    .filter((s) => s.status === "accepted")
    .reduce((sum, s) => sum + s.amount, 0);
  const totalStages = project.stages.reduce((sum, s) => sum + s.amount, 0);

  return (
    <aside
      className="sticky top-6 flex h-fit flex-col gap-5 rounded-lg p-4"
      style={{
        background: "#141416",
        border: "1px solid #26262a",
      }}
    >
      <Section icon={Layers} label="Бюджет">
        {formatBudgetRange(project.budgetFrom, project.budgetTo)}
      </Section>

      <Section icon={User} label="Исполнитель">
        {project.contractorName ?? (
          <span style={{ color: "#7d7d80" }}>Идёт подбор</span>
        )}
      </Section>

      <Section icon={ShieldCheck} label="Сроки">
        {formatDateRange(project.desiredStart, project.desiredEnd)}
      </Section>

      {totalStages > 0 && (
        <Section icon={Lock} label="Эскроу">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "#7d7d80" }}>Зарезервировано</span>
              <span className="font-semibold" style={{ color: "#fbbf24" }}>
                {formatMoney(reserved)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "#7d7d80" }}>Выплачено</span>
              <span className="font-semibold" style={{ color: "#34d399" }}>
                {formatMoney(released)}
              </span>
            </div>
            <div
              className="mt-1 h-1 overflow-hidden rounded-full"
              style={{ background: "#26262a" }}
            >
              <div
                className="h-full"
                style={{
                  width: `${Math.min(100, (released / totalStages) * 100)}%`,
                  background: "linear-gradient(90deg, #34d399, #10b981)",
                }}
                aria-hidden
              />
            </div>
          </div>
        </Section>
      )}

      {project.files.length > 0 && (
        <Section icon={FileText} label={`Документы · ${project.files.length}`}>
          <ul className="space-y-1.5">
            {project.files.slice(0, 4).map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-2 text-xs"
                style={{ color: "#a1a1aa" }}
              >
                <FileText className="size-3 shrink-0" />
                <span className="truncate">{f.name}</span>
              </li>
            ))}
            {project.files.length > 4 && (
              <li className="text-[11px]" style={{ color: "#7d7d80" }}>
                + ещё {project.files.length - 4}
              </li>
            )}
          </ul>
        </Section>
      )}
    </aside>
  );
}

"use client";

// Таблица этапов для менеджера: редактирование статусов, приёмка, выплата.

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ListChecks,
  Paperclip,
  PlusCircle,
  RotateCcw,
  ThumbsUp,
} from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { StageStatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { EscrowDialog } from "@/components/project/EscrowDialog";
import { Button } from "@/components/ui/button";
import { formatDateShort, formatMoney } from "@/lib/format";
import { REVIEW_PHASE_LABEL, STAGE_STATUS } from "@/lib/statuses";
import type { Project, Stage, StageStatus } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface StageManagerProps {
  project: Project;
}

const STAGE_STATUSES: StageStatus[] = [
  "needs_payment",
  "paid",
  "in_progress",
  "review",
  "rework",
  "accepted",
];

export function StageManager({ project }: StageManagerProps) {
  const managerPassToClient = useAppStore((s) => s.managerPassToClient);
  const managerReturnToRework = useAppStore((s) => s.managerReturnToRework);
  const managerSetStageStatus = useAppStore((s) => s.managerSetStageStatus);
  const managerAddStage = useAppStore((s) => s.managerAddStage);

  if (project.stages.length === 0) {
    return (
      <Panel icon={ListChecks} title="Этапы проекта">
        <div className="p-5">
          <EmptyState
            icon={ListChecks}
            title="Этапы не сформированы"
            description="Этапы появятся после того, как клиент выберет подрядчика по итогам тендера."
          />
        </div>
      </Panel>
    );
  }

  const total = project.stages.reduce((s, st) => s + st.amount, 0);
  const inEscrow = project.stages
    .filter((s) => ["paid", "in_progress", "review"].includes(s.status))
    .reduce((s, st) => s + st.amount, 0);
  const paidOut = project.stages
    .filter((s) => s.status === "accepted")
    .reduce((s, st) => s + st.amount, 0);

  return (
    <Panel
      icon={ListChecks}
      title="Этапы проекта"
      description="Ручное управление статусами и выплатами из эскроу"
      flush
      action={
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => managerAddStage(project.id)}
        >
          <PlusCircle className="size-3.5" />
          Добавить этап
        </Button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-2.5">Этап</th>
              <th className="px-3 py-2.5">Статус</th>
              <th className="px-3 py-2.5 text-right">Сумма</th>
              <th className="px-3 py-2.5">Сроки (план)</th>
              <th className="px-5 py-2.5 text-right">Действие</th>
            </tr>
          </thead>
          <tbody>
            {project.stages.map((stage, index) => (
              <tr
                key={stage.id}
                className="border-b last:border-0 hover:bg-muted/30"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-secondary text-xs font-bold text-[#a1a1aa]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{stage.name}</p>
                      {stage.reportFiles.length > 0 && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <Paperclip className="size-3" />
                          {stage.reportFiles.length} файл(ов) отчёта
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3.5">
                  <StatusSelect
                    stage={stage}
                    onSelect={(status) =>
                      managerSetStageStatus(project.id, stage.id, status)
                    }
                  />
                  {stage.status === "review" && stage.reviewPhase && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {REVIEW_PHASE_LABEL[stage.reviewPhase]}
                    </p>
                  )}
                </td>

                <td className="px-3 py-3.5 text-right font-semibold whitespace-nowrap">
                  {formatMoney(stage.amount)}
                </td>

                <td className="px-3 py-3.5 whitespace-nowrap text-muted-foreground">
                  {formatDateShort(stage.planStart)} —{" "}
                  {formatDateShort(stage.planEnd)}
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <ManagerAction
                      project={project}
                      stage={stage}
                      onPassToClient={() =>
                        managerPassToClient(project.id, stage.id)
                      }
                      onReturnToRework={() =>
                        managerReturnToRework(project.id, stage.id)
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/40 px-5 py-3.5">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span>
            В эскроу:{" "}
            <span className="font-semibold text-[#a1a1aa]">
              {formatMoney(inEscrow)}
            </span>
          </span>
          <span>
            Выплачено:{" "}
            <span className="font-semibold text-[#34d399]">
              {formatMoney(paidOut)}
            </span>
          </span>
        </div>
        <p className="text-sm">
          <span className="text-muted-foreground">Итого: </span>
          <span className="text-base font-bold">{formatMoney(total)}</span>
        </p>
      </div>
    </Panel>
  );
}

function StatusSelect({
  stage,
  onSelect,
}: {
  stage: Stage;
  onSelect: (s: StageStatus) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-semibold shadow-sm transition hover:bg-muted"
      >
        <StageStatusBadge status={stage.status} />
        <ChevronDown className="size-3 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <ul className="absolute left-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border bg-card shadow-pop">
            {STAGE_STATUSES.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(s);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center px-3 py-2 text-xs hover:bg-muted",
                    s === stage.status && "bg-muted/60",
                  )}
                >
                  <StageStatusBadge status={s} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function ManagerAction({
  project,
  stage,
  onPassToClient,
  onReturnToRework,
}: {
  project: Project;
  stage: Stage;
  onPassToClient: () => void;
  onReturnToRework: () => void;
}) {
  const muted = (text: string) => (
    <span className="text-xs text-muted-foreground">{text}</span>
  );

  if (stage.status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#34d399]">
        <CheckCircle2 className="size-4" />
        Принят и оплачен
      </span>
    );
  }

  if (stage.status === "review") {
    if (stage.reviewPhase === "manager_check") {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onPassToClient}
          >
            <ThumbsUp className="size-3.5" />
            Передать клиенту
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/8"
            onClick={onReturnToRework}
          >
            <RotateCcw className="size-3.5" />
            На доработку
          </Button>
        </div>
      );
    }
    if (stage.reviewPhase === "awaiting_payout") {
      return (
        <EscrowDialog
          mode="payout"
          projectId={project.id}
          stage={stage}
          counterparty={project.contractorName}
        />
      );
    }
    return muted("Ожидает подтверждения клиента");
  }

  return null;
}

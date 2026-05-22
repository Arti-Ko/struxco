"use client";

// Рабочая таблица этапов проекта для клиента и подрядчика (п. 5.2, 5.3 ТЗ).
// Колонки: Этап, Статус, Сумма, Сроки (план), Действие.

import { CheckCircle2, ListChecks, Paperclip, Play } from "lucide-react";
import { StageStatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Panel } from "@/components/shared/Panel";
import { Button } from "@/components/ui/button";
import { formatDateShort, formatMoney } from "@/lib/format";
import { REVIEW_PHASE_LABEL } from "@/lib/statuses";
import type { Project, Stage } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { EscrowDialog } from "./EscrowDialog";
import { RequestAcceptanceDialog } from "./RequestAcceptanceDialog";

interface StagesTableProps {
  project: Project;
  role: "client" | "contractor";
}

export function StagesTable({ project, role }: StagesTableProps) {
  if (project.stages.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Этапы ещё не сформированы"
        description="Рабочая таблица этапов появится после того, как клиент выберет подрядчика по итогам тендера."
      />
    );
  }

  const total = project.stages.reduce((sum, s) => sum + s.amount, 0);
  const inEscrow = project.stages
    .filter((s) => ["paid", "in_progress", "review"].includes(s.status))
    .reduce((sum, s) => sum + s.amount, 0);
  const paidOut = project.stages
    .filter((s) => s.status === "accepted")
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <Panel
      icon={ListChecks}
      title="Этапы проекта"
      description="Статусы и действия зависят от текущего этапа работ"
      flush
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
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
                className="border-b last:border-0 transition-colors hover:bg-muted/40"
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
                  <StageStatusBadge status={stage.status} />
                  {stage.status === "review" && stage.reviewPhase && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {REVIEW_PHASE_LABEL[stage.reviewPhase]}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3.5 text-right">
                  <p className="font-semibold whitespace-nowrap">
                    {formatMoney(stage.amount)}
                  </p>
                  <EscrowChip status={stage.status} />
                </td>
                <td className="px-3 py-3.5 whitespace-nowrap text-muted-foreground">
                  {formatDateShort(stage.planStart)} —{" "}
                  {formatDateShort(stage.planEnd)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end">
                    <StageAction
                      project={project}
                      stage={stage}
                      role={role}
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
            Выплачено подрядчику:{" "}
            <span className="font-semibold text-[#34d399]">
              {formatMoney(paidOut)}
            </span>
          </span>
        </div>
        <p className="text-sm">
          <span className="text-muted-foreground">Общая сумма проекта: </span>
          <span className="text-base font-bold">{formatMoney(total)}</span>
        </p>
      </div>
    </Panel>
  );
}

function EscrowChip({ status }: { status: Stage["status"] }) {
  if (status === "accepted") {
    return (
      <span className="mt-1 inline-block rounded-full bg-[#34d399]/12 px-2 py-0.5 text-[11px] font-medium text-[#34d399]">
        выплачено
      </span>
    );
  }
  if (["paid", "in_progress", "review"].includes(status)) {
    return (
      <span className="mt-1 inline-block rounded-full bg-[#fafafa]/10 px-2 py-0.5 text-[11px] font-medium text-[#a1a1aa]">
        в эскроу
      </span>
    );
  }
  return null;
}

function StageAction({
  project,
  stage,
  role,
}: {
  project: Project;
  stage: Stage;
  role: "client" | "contractor";
}) {
  const startStageWork = useAppStore((s) => s.startStageWork);
  const clientConfirmAcceptance = useAppStore((s) => s.clientConfirmAcceptance);

  const muted = (text: string) => (
    <span className="text-xs font-medium text-muted-foreground">{text}</span>
  );

  if (stage.status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#34d399]">
        <CheckCircle2 className="size-4" />
        Этап завершён
      </span>
    );
  }

  if (role === "client") {
    if (stage.status === "needs_payment") {
      return <EscrowDialog mode="pay" projectId={project.id} stage={stage} />;
    }
    if (stage.status === "review" && stage.reviewPhase === "client_confirm") {
      return (
        <Button
          size="sm"
          className="h-9 bg-[#34d399] text-[#0b1520] hover:bg-[#10b981]"
          onClick={() => clientConfirmAcceptance(project.id, stage.id)}
        >
          <CheckCircle2 className="size-4" />
          Подтвердить приёмку
        </Button>
      );
    }
    if (stage.status === "review") {
      return muted(
        stage.reviewPhase === "awaiting_payout"
          ? "Ожидает выплаты менеджером"
          : "Проверяет менеджер",
      );
    }
    if (stage.status === "paid") return muted("Оплачен · ждём старта работ");
    if (stage.status === "in_progress") return muted("Подрядчик в работе");
    if (stage.status === "rework") return muted("У подрядчика на доработке");
  }

  if (role === "contractor") {
    if (stage.status === "paid") {
      return (
        <Button
          size="sm"
          className="h-9"
          onClick={() => startStageWork(project.id, stage.id)}
        >
          <Play className="size-4" />
          Начать работу
        </Button>
      );
    }
    if (stage.status === "in_progress") {
      return (
        <RequestAcceptanceDialog
          projectId={project.id}
          stage={stage}
          triggerLabel="Запросить приёмку"
        />
      );
    }
    if (stage.status === "rework") {
      return (
        <RequestAcceptanceDialog
          projectId={project.id}
          stage={stage}
          triggerLabel="Сдать после доработки"
        />
      );
    }
    if (stage.status === "needs_payment")
      return muted("Ожидает оплаты клиентом");
    if (stage.status === "review") {
      return muted(
        stage.reviewPhase === "manager_check"
          ? "Отчёт на проверке"
          : "Ожидает приёмки",
      );
    }
  }

  return muted("—");
}

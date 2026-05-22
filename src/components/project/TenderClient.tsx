"use client";

// Вкладка «Тендер» для клиента (п. 5.2 ТЗ): сравнение КП, выбор подрядчика.

import { CheckCircle2, Clock, Hourglass, TrendingDown, Zap } from "lucide-react";
import { formatMoney, pluralDays } from "@/lib/format";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { ProposalDetailDialog } from "@/components/project/ProposalDetailDialog";
import { useAppStore } from "@/store/useAppStore";
import type { Project, Proposal } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TenderClientProps {
  project: Project;
}

export function TenderClient({ project }: TenderClientProps) {
  const clientSelectProposal = useAppStore((s) => s.clientSelectProposal);

  const validated = project.proposals.filter((p) => p.validatedByManager);
  const totalInvited = project.invitedContractorIds.length;
  const totalSubmitted = project.proposals.length;

  if (validated.length === 0) {
    return (
      <EmptyState
        icon={Hourglass}
        title="КП собираются"
        description={`Приглашено подрядчиков: ${totalInvited}. Подали КП: ${totalSubmitted}. Менеджер проверит предложения и передаст вам на выбор.`}
      />
    );
  }

  if (validated.length === 1) {
    return (
      <EmptyState
        icon={Hourglass}
        title="Ждём второе КП"
        description={`Одно предложение проверено менеджером. Ждём второй ответ от подрядчика — как будет готово, оба появятся здесь для сравнения.`}
      />
    );
  }

  const cheapest = validated.reduce((a, b) => (a.total <= b.total ? a : b));
  const fastest = validated.reduce((a, b) =>
    a.durationDays <= b.durationDays ? a : b,
  );

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Менеджер платформы проверил оба предложения. Сравните и выберите
        подрядчика — после выбора автоматически сформируется рабочая таблица
        этапов.
      </p>
      <div className="grid gap-5 lg:grid-cols-2">
        {validated.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            isCheapest={proposal.id === cheapest.id}
            isFastest={proposal.id === fastest.id}
            onSelect={() => clientSelectProposal(project.id, proposal.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ProposalCard({
  proposal,
  isCheapest,
  isFastest,
  onSelect,
}: {
  proposal: Proposal;
  isCheapest: boolean;
  isFastest: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card",
        (isCheapest || isFastest) && "ring-1 ring-[#fafafa]/30",
      )}
    >
      {/* Tags */}
      {(isCheapest || isFastest) && (
        <div className="flex gap-2 bg-[#fafafa]/6 px-4 py-2.5">
          {isCheapest && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#34d399]/12 px-2.5 py-1 text-[11px] font-bold text-[#34d399]">
              <TrendingDown className="size-3" />
              Выгоднее по цене
            </span>
          )}
          {isFastest && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fbbf24]/12 px-2.5 py-1 text-[11px] font-bold text-[#fbbf24]">
              <Zap className="size-3" />
              Быстрее по срокам
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Подрядчик
          </p>
          <p className="mt-0.5 text-lg font-bold">{proposal.contractorName}</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-muted/40 p-3.5">
            <p className="text-xs font-medium text-muted-foreground">
              Итоговая сумма
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight">
              {formatMoney(proposal.total)}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-3.5">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Clock className="size-3" />
              Срок выполнения
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight">
              {pluralDays(proposal.durationDays)}
            </p>
          </div>
        </div>

        {/* Stages count */}
        <p className="text-sm text-muted-foreground">
          Этапов в КП: <span className="font-semibold text-foreground">{proposal.stages.length}</span>
        </p>

        {/* Comment */}
        {proposal.comment && (
          <div className="rounded-xl border border-[#fafafa]/15 bg-[#fafafa]/6 px-3.5 py-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              «{proposal.comment}»
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <ProposalDetailDialog proposal={proposal} />
          <Button
            className="h-10 w-full"
            onClick={onSelect}
          >
            <CheckCircle2 className="size-4" />
            Выбрать этого подрядчика
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

// Панель участников тендера: список приглашённых подрядчиков, валидация КП.

import { CheckCircle2, HardHat, ShieldCheck } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProposalDetailDialog } from "@/components/project/ProposalDetailDialog";
import { Button } from "@/components/ui/button";
import { formatMoney, pluralDays } from "@/lib/format";
import type { Project } from "@/lib/types";
import { CONTRACTORS } from "@/store/seed";
import { useAppStore } from "@/store/useAppStore";

interface ParticipantsPanelProps {
  project: Project;
}

export function ParticipantsPanel({ project }: ParticipantsPanelProps) {
  const managerValidateProposal = useAppStore((s) => s.managerValidateProposal);

  const invited = CONTRACTORS.filter((c) =>
    project.invitedContractorIds.includes(c.id),
  );

  if (invited.length === 0) {
    return (
      <EmptyState
        icon={HardHat}
        title="Подрядчики не приглашены"
        description="После открытия тендера здесь появятся приглашённые подрядчики и их КП."
      />
    );
  }

  return (
    <Panel icon={HardHat} title="Участники тендера">
      <ul className="space-y-3 p-4">
        {invited.map((contractor) => {
          const proposal = project.proposals.find(
            (pr) => pr.contractorId === contractor.id,
          );
          const isSelected = project.contractorId === contractor.id;

          return (
            <li
              key={contractor.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/30 p-3.5"
            >
              {/* Avatar */}
              <span
                className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                style={{
                  backgroundColor: isSelected ? "#34d399" : "#fafafa",
                }}
              >
                {contractor.name.charAt(0)}
              </span>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{contractor.name}</p>
                <p className="text-xs text-muted-foreground">
                  {contractor.contactPerson} · {contractor.contact}
                </p>
              </div>

              {/* КП status */}
              {isSelected && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#34d399]/12 px-2.5 py-1 text-xs font-bold text-[#34d399]">
                  <CheckCircle2 className="size-3.5" />
                  Выбран клиентом
                </span>
              )}

              {!proposal ? (
                <span className="text-xs text-muted-foreground">
                  КП не подано
                </span>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {/* Proposal summary */}
                  <span className="text-sm font-semibold">
                    {formatMoney(proposal.total)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {pluralDays(proposal.durationDays)}
                  </span>

                  <ProposalDetailDialog proposal={proposal} />

                  {!proposal.validatedByManager ? (
                    <Button
                      size="sm"
                      className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() =>
                        managerValidateProposal(project.id, proposal.id)
                      }
                    >
                      <ShieldCheck className="size-3.5" />
                      Проверить КП
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#34d399]/12 px-2.5 py-1 text-xs font-semibold text-[#34d399]">
                      <CheckCircle2 className="size-3.5" />
                      Проверено
                    </span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

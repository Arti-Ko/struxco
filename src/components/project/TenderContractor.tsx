"use client";

// Вкладка «Тендер» для подрядчика (п. 5.3 ТЗ): форма подачи КП.

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Gavel,
  PlusCircle,
  Send,
  Trash2,
} from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Panel } from "@/components/shared/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatMoney, pluralDays } from "@/lib/format";
import type { Project, Proposal, ProposalStage } from "@/lib/types";
import { CURRENT_CONTRACTOR_ID } from "@/store/seed";
import { useAppStore } from "@/store/useAppStore";

interface TenderContractorProps {
  project: Project;
}

interface StageRow extends ProposalStage {
  key: number;
}

let rowKey = 0;
function newRow(): StageRow {
  rowKey += 1;
  return { key: rowKey, name: "", amount: 0, durationDays: 14 };
}

export function TenderContractor({ project }: TenderContractorProps) {
  const contractorSubmitProposal = useAppStore(
    (s) => s.contractorSubmitProposal,
  );

  const isInvited = project.invitedContractorIds.includes(CURRENT_CONTRACTOR_ID);
  const myProposal = project.proposals.find(
    (p) => p.contractorId === CURRENT_CONTRACTOR_ID,
  );

  if (!isInvited) {
    return (
      <EmptyState
        icon={Gavel}
        title="Вы не приглашены в этот тендер"
        description="Менеджер платформы формирует закрытый short-list подрядчиков. Приглашение появится здесь, если ваша компания будет выбрана."
      />
    );
  }

  if (myProposal) {
    return <SubmittedView proposal={myProposal} />;
  }

  return (
    <SubmitForm
      project={project}
      onSubmit={(data) => contractorSubmitProposal(project.id, data)}
    />
  );
}

function SubmittedView({ proposal }: { proposal: Proposal }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-[#34d399]/20 bg-[#34d399]/8 px-4 py-3.5 text-sm font-medium text-[#34d399]">
        <CheckCircle2 className="size-5 shrink-0" />
        <p>
          КП отправлено и{" "}
          {proposal.validatedByManager
            ? "проверено менеджером — ждём решения клиента."
            : "ожидает проверки менеджером платформы."}
        </p>
      </div>

      <Panel icon={Clock} title="Ваше коммерческое предложение">
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="rounded-xl border bg-muted/40 p-3.5">
            <p className="text-xs text-muted-foreground">Итоговая сумма</p>
            <p className="mt-1 text-xl font-bold">{formatMoney(proposal.total)}</p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-3.5">
            <p className="text-xs text-muted-foreground">Срок выполнения</p>
            <p className="mt-1 text-xl font-bold">
              {pluralDays(proposal.durationDays)}
            </p>
          </div>
        </div>

        <ul className="divide-y border-t">
          {proposal.stages.map((stage, i) => (
            <li
              key={i}
              className="flex items-center gap-3 px-4 py-3 text-sm"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary text-xs font-bold text-[#a1a1aa]">
                {i + 1}
              </span>
              <span className="flex-1 font-medium">{stage.name}</span>
              <span className="text-muted-foreground">
                {pluralDays(stage.durationDays)}
              </span>
              <span className="font-semibold whitespace-nowrap">
                {formatMoney(stage.amount)}
              </span>
            </li>
          ))}
        </ul>

        {proposal.comment && (
          <div className="border-t px-4 py-3.5">
            <p className="text-xs font-semibold text-muted-foreground">
              Комментарий
            </p>
            <p className="mt-1 text-sm">{proposal.comment}</p>
          </div>
        )}
      </Panel>
    </div>
  );
}

function SubmitForm({
  project,
  onSubmit,
}: {
  project: Project;
  onSubmit: (data: {
    total: number;
    durationDays: number;
    comment: string;
    stages: ProposalStage[];
  }) => void;
}) {
  const [stages, setStages] = useState<StageRow[]>([newRow()]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateStage = (key: number, patch: Partial<StageRow>) => {
    setStages((prev) =>
      prev.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    );
  };

  const removeStage = (key: number) => {
    if (stages.length === 1) return;
    setStages((prev) => prev.filter((s) => s.key !== key));
  };

  const total = stages.reduce((sum, s) => sum + (s.amount || 0), 0);
  const durationDays = stages.reduce((sum, s) => sum + (s.durationDays || 0), 0);
  const canSubmit =
    total > 0 &&
    durationDays > 0 &&
    stages.every((s) => s.name.trim() && s.amount > 0 && s.durationDays > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    onSubmit({
      total,
      durationDays,
      comment: comment.trim(),
      stages: stages.map(({ name, amount, durationDays: d }) => ({
        name,
        amount,
        durationDays: d,
      })),
    });
  };

  return (
    <div className="space-y-5">
      <Panel icon={Gavel} title="Подача коммерческого предложения" flush>
        {/* Budget hint */}
        <div className="border-b px-5 py-3.5">
          <p className="text-sm text-muted-foreground">
            Бюджет клиента:{" "}
            <span className="font-semibold text-foreground">
              {formatMoney(project.budgetFrom)} — {formatMoney(project.budgetTo)}
            </span>
          </p>
        </div>

        {/* Stages table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-2.5 w-8">#</th>
                <th className="px-3 py-2.5">Название этапа</th>
                <th className="px-3 py-2.5 w-40">Сумма, ₽</th>
                <th className="px-3 py-2.5 w-32">Срок, дн.</th>
                <th className="px-4 py-2.5 w-10" />
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, index) => (
                <tr
                  key={stage.key}
                  className="border-b last:border-0"
                >
                  <td className="px-5 py-2.5">
                    <span className="grid size-6 place-items-center rounded-md bg-secondary text-xs font-bold text-[#a1a1aa]">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={stage.name}
                      onChange={(e) =>
                        updateStage(stage.key, { name: e.target.value })
                      }
                      placeholder="Название этапа"
                      className="h-9"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={0}
                      value={stage.amount || ""}
                      onChange={(e) =>
                        updateStage(stage.key, {
                          amount: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                      className="h-9"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={1}
                      value={stage.durationDays || ""}
                      onChange={(e) =>
                        updateStage(stage.key, {
                          durationDays: Number(e.target.value),
                        })
                      }
                      placeholder="14"
                      className="h-9"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => removeStage(stage.key)}
                      disabled={stages.length === 1}
                      className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-[#ef4444] disabled:opacity-30"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/40 px-5 py-3.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStages((prev) => [...prev, newRow()])}
          >
            <PlusCircle className="size-4" />
            Добавить этап
          </Button>
          <div className="text-sm">
            <span className="text-muted-foreground">Итого: </span>
            <span className="text-base font-bold">{formatMoney(total)}</span>
            {durationDays > 0 && (
              <span className="ml-3 text-muted-foreground">
                · {pluralDays(durationDays)}
              </span>
            )}
          </div>
        </div>
      </Panel>

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="kp-comment">
          Комментарий к КП{" "}
          <span className="font-normal text-muted-foreground">(необязательно)</span>
        </Label>
        <Textarea
          id="kp-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Укажите ключевые преимущества вашего предложения, опыт, гарантии…"
          className="resize-none"
        />
      </div>

      <div className="flex justify-end">
        <Button
          className="h-11 px-6"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          <Send className="size-4" />
          Отправить КП
        </Button>
      </div>
    </div>
  );
}

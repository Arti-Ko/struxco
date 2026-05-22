"use client";

// Модальное окно «Посмотреть детали КП» (п. 5.2 ТЗ) — разбивка по этапам.

import { useState } from "react";
import { Clock, FileSpreadsheet, Layers } from "lucide-react";
import { formatMoney, pluralDays } from "@/lib/format";
import type { Proposal } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProposalDetailDialogProps {
  proposal: Proposal;
}

export function ProposalDetailDialog({ proposal }: ProposalDetailDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" className="h-10 w-full" />}
      >
        <FileSpreadsheet className="size-4" />
        Посмотреть детали КП
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>КП: {proposal.contractorName}</DialogTitle>
          <DialogDescription>
            Коммерческое предложение с разбивкой по этапам
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-muted/40 p-3.5">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileSpreadsheet className="size-3.5" />
              Итоговая смета
            </p>
            <p className="mt-1 text-lg font-bold">
              {formatMoney(proposal.total)}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-3.5">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Срок выполнения
            </p>
            <p className="mt-1 text-lg font-bold">
              {pluralDays(proposal.durationDays)}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <Layers className="size-4 text-[#a1a1aa]" />
            Детализация по этапам
          </p>
          <ul className="overflow-hidden rounded-xl border">
            {proposal.stages.map((stage, index) => (
              <li
                key={`${stage.name}-${index}`}
                className="flex items-center gap-3 border-b px-3.5 py-2.5 last:border-0"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary text-xs font-bold text-[#a1a1aa]">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {stage.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pluralDays(stage.durationDays)}
                  </span>
                </span>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {formatMoney(stage.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {proposal.comment && (
          <div className="rounded-xl border border-[#fafafa]/15 bg-[#fafafa]/6 p-3.5">
            <p className="text-xs font-semibold text-[#a1a1aa]">
              Комментарий подрядчика
            </p>
            <p className="mt-1 text-sm">{proposal.comment}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

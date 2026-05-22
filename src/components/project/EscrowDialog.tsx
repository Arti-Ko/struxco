"use client";

// Кликабельный макет финансового контура (п. 9.7 ТЗ): оплата этапа в эскроу
// и выплата подрядчику из эскроу. Реальной банковской интеграции нет.

import { useState } from "react";
import { Landmark, Lock, ShieldCheck } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { Stage } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EscrowMode = "pay" | "payout";

interface EscrowDialogProps {
  mode: EscrowMode;
  projectId: string;
  stage: Stage;
  /** Имя стороны-получателя для текста выплаты. */
  counterparty?: string;
}

const COPY: Record<
  EscrowMode,
  {
    trigger: string;
    triggerClass: string;
    title: string;
    note: string;
    methodLabel: string;
    method: string;
    confirm: (sum: string) => string;
  }
> = {
  pay: {
    trigger: "Оплатить этап",
    triggerClass: "bg-[#ef4444] text-white hover:bg-[#dc2626]",
    title: "Оплата этапа",
    note: "Средства резервируются на эскроу-счёте платформы и будут переведены подрядчику только после приёмки результата.",
    methodLabel: "Счёт списания",
    method: "Расчётный счёт ООО «Вертикаль» ···· 4471",
    confirm: (sum) => `Перевести ${sum} в эскроу`,
  },
  payout: {
    trigger: "Выплатить подрядчику",
    triggerClass: "bg-[#10b981] text-white hover:bg-[#059669]",
    title: "Выплата из эскроу",
    note: "Этап принят клиентом. Средства списываются с эскроу-счёта платформы и переводятся подрядчику.",
    methodLabel: "Счёт зачисления",
    method: "Счёт подрядчика",
    confirm: (sum) => `Выплатить ${sum}`,
  },
};

export function EscrowDialog({
  mode,
  projectId,
  stage,
  counterparty,
}: EscrowDialogProps) {
  const [open, setOpen] = useState(false);
  const payStage = useAppStore((s) => s.payStage);
  const managerPayout = useAppStore((s) => s.managerPayout);
  const copy = COPY[mode];
  const sum = formatMoney(stage.amount);

  const confirm = () => {
    if (mode === "pay") payStage(projectId, stage.id);
    else managerPayout(projectId, stage.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button size="sm" className={`h-9 ${copy.triggerClass}`} />}
      >
        {copy.trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{stage.name}</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border bg-muted/40 p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Сумма этапа
          </p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight">{sum}</p>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-[#fafafa]/20 bg-[#fafafa]/6 p-3.5 text-sm text-[#ededed]">
          <ShieldCheck className="mt-0.5 size-4.5 shrink-0" />
          <p>
            {copy.note}
            {mode === "payout" && counterparty ? ` Получатель — ${counterparty}.` : ""}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border p-3.5">
          <span className="grid size-9 place-items-center rounded-lg bg-secondary text-[#ededed]">
            <Landmark className="size-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{copy.methodLabel}</p>
            <p className="truncate text-sm font-medium">{copy.method}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <DialogClose render={<Button variant="outline" className="h-10" />}>
            Отмена
          </DialogClose>
          <Button
            className={`h-10 ${copy.triggerClass}`}
            onClick={confirm}
          >
            <Lock className="size-4" />
            {copy.confirm(sum)}
          </Button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Демо-режим: реальная транзакция не выполняется.
        </p>
      </DialogContent>
    </Dialog>
  );
}

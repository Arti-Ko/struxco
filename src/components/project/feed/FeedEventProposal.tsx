"use client";

import { Layers } from "lucide-react";
import type { ProposalSubmittedEvent } from "@/lib/projectFeed";
import type { Role } from "@/lib/types";
import { formatMoney, pluralDays } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface Props {
  event: ProposalSubmittedEvent;
  /** Текущая роль зрителя — определяет какие inline-actions показать. */
  viewerRole: Role;
  /** Может быть undefined у клиента, если КП ещё не валидировано. */
  isValidated: boolean;
  /** Кнопка «Сравнить КП» открывает существующий диалог сравнения. */
  onCompare?: () => void;
  /** Менеджер: пометить КП валидированным. */
  onValidate?: () => void;
  /** Клиент: выбрать этого подрядчика как победителя тендера. */
  onSelect?: () => void;
}

/**
 * Поступление КП — карточка с краткой сводкой и inline-actions.
 * - Менеджер: «Проверить КП» (validate) — если не валидировано.
 * - Клиент: «Выбрать подрядчика» — если валидировано.
 * - Все роли: «Открыть сравнение» — переход в существующий диалог.
 */
export function FeedEventProposal({
  event,
  viewerRole,
  isValidated,
  onCompare,
  onValidate,
  onSelect,
}: Props) {
  const { proposal } = event;

  return (
    <article
      className="flex flex-col gap-3 rounded-lg p-4"
      style={{
        background: "#141416",
        border: "1px solid #26262a",
      }}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-md"
            style={{
              background: "#fbbf241a",
              color: "#fbbf24",
              boxShadow: "inset 0 0 0 1px #fbbf2433",
            }}
            aria-hidden
          >
            <Layers className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#fbbf24" }}>
              Коммерческое предложение
            </p>
            <p className="mt-0.5 text-sm font-semibold" style={{ color: "#ededed" }}>
              {proposal.contractorName}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-[11px]" style={{ color: "#7d7d80" }}>
          {event.atLabel}
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="eyebrow">Сумма</dt>
          <dd className="mt-1 font-semibold" style={{ color: "#ededed" }}>
            {formatMoney(proposal.total)}
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Срок</dt>
          <dd className="mt-1 font-semibold" style={{ color: "#ededed" }}>
            {pluralDays(proposal.durationDays)}
          </dd>
        </div>
      </dl>

      {proposal.comment && (
        <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
          «{proposal.comment}»
        </p>
      )}

      <footer className="flex flex-wrap items-center gap-2 pt-1">
        {viewerRole === "manager" && !isValidated && onValidate && (
          <Button
            size="sm"
            className="h-8"
            style={{ background: "#fafafa", color: "#0a0a0c" }}
            onClick={onValidate}
          >
            Подтвердить КП
          </Button>
        )}
        {viewerRole === "client" && isValidated && onSelect && (
          <Button
            size="sm"
            className="h-8"
            style={{ background: "#fafafa", color: "#0a0a0c" }}
            onClick={onSelect}
          >
            Выбрать подрядчика
          </Button>
        )}
        {onCompare && (
          <button
            type="button"
            onClick={onCompare}
            className="h-8 rounded-md px-3 text-xs font-semibold transition"
            style={{
              border: "1px solid #26262a",
              color: "#ededed",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3a3a3f";
              e.currentTarget.style.background = "#1c1c1f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#26262a";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Открыть сравнение
          </button>
        )}
        {!isValidated && viewerRole !== "manager" && (
          <span className="text-[11px]" style={{ color: "#7d7d80" }}>
            Ждёт проверки менеджером
          </span>
        )}
      </footer>
    </article>
  );
}

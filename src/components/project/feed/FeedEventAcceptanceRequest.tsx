"use client";

import { CheckCircle2, FileText, RotateCcw } from "lucide-react";
import type { AcceptanceRequestEvent } from "@/lib/projectFeed";
import type { Role } from "@/lib/types";
import { formatMoney } from "@/lib/format";
import { REVIEW_PHASE_LABEL } from "@/lib/statuses";
import { Button } from "@/components/ui/button";

interface Props {
  event: AcceptanceRequestEvent;
  viewerRole: Role;
  /** Менеджер: передать клиенту на подтверждение. */
  onPassToClient?: () => void;
  /** Клиент: подтвердить приёмку. */
  onConfirm?: () => void;
  /** Менеджер: выплатить из эскроу подрядчику. */
  onPayout?: () => void;
  /** Менеджер: вернуть на доработку. */
  onReturnToRework?: () => void;
}

/**
 * Запрос приёмки этапа — основной CTA-блок ленты. Какие inline-actions
 * показывать определяется парой (roleViewer, stage.reviewPhase).
 */
export function FeedEventAcceptanceRequest({
  event,
  viewerRole,
  onPassToClient,
  onConfirm,
  onPayout,
  onReturnToRework,
}: Props) {
  const { stage } = event;
  const phase = stage.reviewPhase ?? "manager_check";
  const phaseLabel = REVIEW_PHASE_LABEL[phase];

  // Какие действия доступны на этой фазе для текущей роли
  const canManagerPass = viewerRole === "manager" && phase === "manager_check";
  const canManagerPayout =
    viewerRole === "manager" && phase === "awaiting_payout";
  const canManagerReturn =
    viewerRole === "manager" &&
    (phase === "manager_check" || phase === "client_confirm");
  const canClientConfirm =
    viewerRole === "client" && phase === "client_confirm";

  return (
    <article
      className="flex flex-col gap-4 rounded-lg p-4"
      style={{
        background: "#141416",
        border: "1px solid #fbbf2433",
        boxShadow: "inset 0 0 0 1px #fbbf241a",
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
            <CheckCircle2 className="size-4" />
          </span>
          <div className="min-w-0">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#fbbf24" }}
            >
              Запрос приёмки
            </p>
            <p
              className="mt-0.5 text-sm font-semibold"
              style={{ color: "#ededed" }}
            >
              {stage.name}
            </p>
            <p className="mt-0.5 text-[11px]" style={{ color: "#7d7d80" }}>
              {phaseLabel} · {formatMoney(stage.amount)}
            </p>
          </div>
        </div>
      </header>

      {stage.reportFiles.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="eyebrow">Отчёт</p>
          <ul className="space-y-1">
            {stage.reportFiles.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-2 text-xs"
                style={{ color: "#a1a1aa" }}
              >
                <FileText className="size-3.5 shrink-0" />
                <span className="truncate">{f.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="flex flex-wrap items-center gap-2">
        {canManagerPass && onPassToClient && (
          <Button
            size="sm"
            className="h-8"
            style={{ background: "#fafafa", color: "#0a0a0c" }}
            onClick={onPassToClient}
          >
            Передать клиенту
          </Button>
        )}
        {canClientConfirm && onConfirm && (
          <Button
            size="sm"
            className="h-8"
            style={{ background: "#fafafa", color: "#0a0a0c" }}
            onClick={onConfirm}
          >
            Подтвердить приёмку
          </Button>
        )}
        {canManagerPayout && onPayout && (
          <Button
            size="sm"
            className="h-8"
            style={{ background: "#34d399", color: "#052e1c" }}
            onClick={onPayout}
          >
            Выплатить из эскроу
          </Button>
        )}
        {canManagerReturn && onReturnToRework && (
          <button
            type="button"
            onClick={onReturnToRework}
            className="flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition"
            style={{
              border: "1px solid #26262a",
              color: "#f87171",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#f8717155";
              e.currentTarget.style.background = "#f871711a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#26262a";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <RotateCcw className="size-3.5" />
            На доработку
          </button>
        )}
        {!canManagerPass &&
          !canClientConfirm &&
          !canManagerPayout &&
          viewerRole !== "manager" && (
            <span className="text-[11px]" style={{ color: "#7d7d80" }}>
              Ждём действие: {phaseLabel.toLowerCase()}
            </span>
          )}
      </footer>
    </article>
  );
}

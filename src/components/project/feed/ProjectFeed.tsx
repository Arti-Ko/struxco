"use client";

import { useMemo } from "react";
import {
  deriveFeedEvents,
  filterFeed,
  type FeedEvent,
  type FeedFilter,
} from "@/lib/projectFeed";
import type { Project, Role } from "@/lib/types";
import { FeedEventActivity } from "./FeedEventActivity";
import { FeedEventFile } from "./FeedEventFile";
import { FeedEventMessage } from "./FeedEventMessage";
import { FeedEventProposal } from "./FeedEventProposal";
import { FeedEventAcceptanceRequest } from "./FeedEventAcceptanceRequest";

export interface FeedActions {
  /** Менеджер: подтвердить КП. */
  onValidateProposal?: (proposalId: string) => void;
  /** Клиент: выбрать подрядчика по КП. */
  onSelectProposal?: (proposalId: string) => void;
  /** Все роли: открыть подробный диалог сравнения. */
  onOpenProposal?: (proposalId: string) => void;

  /** Менеджер: передать клиенту на подтверждение. */
  onPassToClient?: (stageId: string) => void;
  /** Клиент: подтвердить приёмку. */
  onConfirmAcceptance?: (stageId: string) => void;
  /** Менеджер: выплатить из эскроу. */
  onPayout?: (stageId: string) => void;
  /** Менеджер: вернуть на доработку. */
  onReturnToRework?: (stageId: string) => void;
}

interface ProjectFeedProps {
  project: Project;
  viewerRole: Role;
  filter?: FeedFilter;
  actions?: FeedActions;
  /** Нижний слот — обычно FeedComposer. */
  footer?: React.ReactNode;
}

/**
 * Conversation-first вью проекта: события всех типов в одной хронологической
 * ленте. Inline-actions делегируются вверх через `actions`.
 */
export function ProjectFeed({
  project,
  viewerRole,
  filter = "all",
  actions,
  footer,
}: ProjectFeedProps) {
  const events = useMemo(() => {
    const raw = deriveFeedEvents(project);
    return filterFeed(raw, filter);
  }, [project, filter]);

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col">
      <ol className="space-y-5">
        {events.map((event) => (
          <li key={event.id}>{renderEvent(event, viewerRole, actions)}</li>
        ))}
        {events.length === 0 && (
          <li
            className="rounded-lg p-6 text-center text-sm"
            style={{
              background: "#141416",
              border: "1px dashed #26262a",
              color: "#7d7d80",
            }}
          >
            По выбранному фильтру событий нет.
          </li>
        )}
      </ol>
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}

function renderEvent(
  event: FeedEvent,
  viewerRole: Role,
  actions: FeedActions | undefined,
): React.ReactNode {
  switch (event.kind) {
    case "message":
      return <FeedEventMessage event={event} />;
    case "file_uploaded":
      return <FeedEventFile event={event} />;
    case "activity":
      return <FeedEventActivity event={event} />;
    case "proposal_submitted":
      return (
        <FeedEventProposal
          event={event}
          viewerRole={viewerRole}
          isValidated={event.proposal.validatedByManager}
          onCompare={
            actions?.onOpenProposal
              ? () => actions.onOpenProposal?.(event.proposal.id)
              : undefined
          }
          onValidate={
            actions?.onValidateProposal
              ? () => actions.onValidateProposal?.(event.proposal.id)
              : undefined
          }
          onSelect={
            actions?.onSelectProposal
              ? () => actions.onSelectProposal?.(event.proposal.id)
              : undefined
          }
        />
      );
    case "acceptance_request":
      return (
        <FeedEventAcceptanceRequest
          event={event}
          viewerRole={viewerRole}
          onPassToClient={
            actions?.onPassToClient
              ? () => actions.onPassToClient?.(event.stage.id)
              : undefined
          }
          onConfirm={
            actions?.onConfirmAcceptance
              ? () => actions.onConfirmAcceptance?.(event.stage.id)
              : undefined
          }
          onPayout={
            actions?.onPayout
              ? () => actions.onPayout?.(event.stage.id)
              : undefined
          }
          onReturnToRework={
            actions?.onReturnToRework
              ? () => actions.onReturnToRework?.(event.stage.id)
              : undefined
          }
        />
      );
  }
}

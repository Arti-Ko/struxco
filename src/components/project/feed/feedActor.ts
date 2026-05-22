// Метаданные участников/системы для рендера в ленте проекта.

import type { EventActor } from "@/lib/projectFeed";

export interface ActorMeta {
  label: string;
  color: string;   // hex акцентного цвета аватара
  initials: string;
}

const ACTOR_META: Record<EventActor, ActorMeta> = {
  client:     { label: "Заказчик",  color: "#71717a", initials: "З" },
  contractor: { label: "Подрядчик", color: "#fbbf24", initials: "П" },
  manager:    { label: "Платформа", color: "#34d399", initials: "S" },
  platform:   { label: "Платформа", color: "#34d399", initials: "S" },
  system:     { label: "Система",   color: "#7d7d80", initials: "·" },
};

export function actorMeta(actor: EventActor): ActorMeta {
  return ACTOR_META[actor] ?? ACTOR_META.system;
}

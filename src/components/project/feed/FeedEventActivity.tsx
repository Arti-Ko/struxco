import type { ActivityEvent } from "@/lib/projectFeed";
import { actorMeta } from "./feedActor";

interface Props {
  event: ActivityEvent;
}

/**
 * Системные записи журнала действий — низкоприоритетные, в одну строку
 * с цветной точкой actor'а. Не имеют hover-состояния, не кликабельны.
 */
export function FeedEventActivity({ event }: Props) {
  const meta = actorMeta(event.actor);
  return (
    <div
      className="flex items-baseline gap-2 pl-3 text-[13px] leading-snug"
      style={{ color: "#7d7d80" }}
    >
      <span
        className="inline-block size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
        aria-hidden
      />
      <span className="flex-1">
        <span style={{ color: meta.color }}>{meta.label}: </span>
        {event.text}
      </span>
      <span className="shrink-0 text-[11px]" style={{ color: "#3a3a3f" }}>
        {event.atLabel}
      </span>
    </div>
  );
}

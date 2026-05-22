import type { MessageEvent } from "@/lib/projectFeed";
import { actorMeta } from "./feedActor";
import { FeedAvatar } from "./FeedAvatar";

interface Props {
  event: MessageEvent;
}

/**
 * Сообщение в ленте — пост-стиль (а не пузырь как в чате).
 * Аватар автора слева, имя/время/текст справа. Платформенные сообщения
 * получают зелёный значок.
 */
export function FeedEventMessage({ event }: Props) {
  const meta = actorMeta(event.authorRole);
  const isPlatform = event.authorRole === "platform";

  return (
    <article className="flex items-start gap-3">
      <FeedAvatar color={meta.color} initials={meta.initials} />
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-2 text-xs">
          <span className="font-semibold" style={{ color: meta.color }}>
            {event.authorName}
          </span>
          {isPlatform && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
              style={{
                background: "#34d39922",
                color: "#34d399",
                boxShadow: "inset 0 0 0 1px #34d39944",
              }}
            >
              Платформа
            </span>
          )}
          <span style={{ color: "#7d7d80" }}>· {event.atLabel}</span>
        </header>
        <p
          className="mt-1.5 text-[15px] leading-relaxed"
          style={{ color: "#ededed" }}
        >
          {event.text}
        </p>
        {event.attachment && (
          <p className="mt-1 text-xs" style={{ color: "#7d7d80" }}>
            📎 {event.attachment}
          </p>
        )}
      </div>
    </article>
  );
}

import type { MessageEvent } from "@/lib/projectFeed";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { actorMeta } from "./feedActor";
import { FeedAvatar } from "./FeedAvatar";

interface Props {
  event: MessageEvent;
  viewerRole: Role;
  /** true — это часть подряд идущей группы того же автора; не показываем шапку. */
  compact?: boolean;
}

/**
 * Сообщение в стиле мессенджера:
 * - Своё (автор = текущая роль)            → справа, белая плашка, тёмный текст
 * - Чужое (другой участник)                → слева с аватаром, тёмная плашка
 * - Платформенное (системное от Struxco)   → центрированная узкая плашка,
 *   зелёный тинт; если зритель = менеджер, плашка справа (это его действие)
 *
 * Группировка: если предыдущее событие — сообщение того же автора, передаём
 * `compact`, шапка скрывается, у плашки нет «носика» (одинаковые радиусы).
 */

function isViewerAuthor(
  viewerRole: Role,
  authorRole: Role | "platform",
): boolean {
  if (viewerRole === "manager") {
    return authorRole === "platform" || authorRole === "manager";
  }
  return authorRole === viewerRole;
}

export function FeedEventMessage({ event, viewerRole, compact = false }: Props) {
  const meta = actorMeta(event.authorRole);
  const isPlatform = event.authorRole === "platform";
  const isSelf = isViewerAuthor(viewerRole, event.authorRole);

  // Платформенные сообщения, когда зритель НЕ менеджер — центрированный
  // system-notice. У менеджера платформа = он сам → правое выравнивание.
  if (isPlatform && viewerRole !== "manager") {
    return (
      <div className="flex justify-center">
        <div
          className="max-w-[80%] rounded-xl px-3.5 py-2 text-center text-[13px] leading-relaxed"
          style={{
            background: "rgba(52,211,153,0.08)",
            color: "#a7f3d0",
            boxShadow: "inset 0 0 0 1px rgba(52,211,153,0.18)",
          }}
        >
          {!compact && (
            <div
              className="mb-0.5 text-[10px] font-semibold tracking-wider uppercase"
              style={{ color: "#34d399" }}
            >
              {event.authorName} · {event.atLabel}
            </div>
          )}
          {event.text}
        </div>
      </div>
    );
  }

  // Свои сообщения справа, чужие — слева
  const alignment = isSelf ? "justify-end" : "justify-start";
  // Зелёная плашка для платформы у менеджера, иначе белая / тёмная
  const bubbleStyle: React.CSSProperties = isSelf
    ? isPlatform
      ? {
          background: "rgba(52,211,153,0.14)",
          color: "#ecfdf5",
          boxShadow: "inset 0 0 0 1px rgba(52,211,153,0.32)",
        }
      : {
          background: "#fafafa",
          color: "#0a0a0c",
        }
    : {
        background: "#1c1c1f",
        color: "#ededed",
        boxShadow: "inset 0 0 0 1px #26262a",
      };

  // Корнеры: у первого в группе один угол со «спойлером»,
  // у последующих — все радиусы одинаковые (хвост убран).
  const cornerClass = compact
    ? "rounded-2xl"
    : isSelf
      ? "rounded-2xl rounded-tr-md"
      : "rounded-2xl rounded-tl-md";

  return (
    <div className={cn("flex items-end gap-2.5", alignment)}>
      {/* Левый аватар для чужих сообщений (только в начале группы) */}
      {!isSelf && (
        <div className="w-7 shrink-0">
          {!compact && (
            <FeedAvatar
              color={meta.color}
              initials={meta.initials}
              size="sm"
            />
          )}
        </div>
      )}

      <div
        className={cn(
          "flex max-w-[78%] flex-col gap-0.5",
          isSelf ? "items-end" : "items-start",
        )}
      >
        {/* Шапка: имя + время, только в начале группы */}
        {!compact && (
          <div
            className={cn(
              "flex items-center gap-1.5 px-1 text-[11px]",
              isSelf ? "flex-row-reverse" : "flex-row",
            )}
          >
            <span
              className="font-semibold"
              style={{ color: isSelf ? "#a1a1aa" : meta.color }}
            >
              {isSelf ? "Вы" : event.authorName}
            </span>
            <span style={{ color: "#7d7d80" }}>· {event.atLabel}</span>
          </div>
        )}

        <div
          className={cn("px-3.5 py-2 text-[14px] leading-relaxed", cornerClass)}
          style={bubbleStyle}
        >
          {event.text}
          {event.attachment && (
            <div
              className={cn(
                "mt-1.5 text-[11px]",
                isSelf ? "text-black/60" : "",
              )}
              style={!isSelf ? { color: "#7d7d80" } : undefined}
            >
              📎 {event.attachment}
            </div>
          )}
        </div>

        {/* В сжатом виде показываем время только в углу плашки, незаметно */}
        {compact && (
          <span
            className="px-1 text-[10px]"
            style={{ color: "#3a3a3f" }}
          >
            {event.atLabel}
          </span>
        )}
      </div>

      {/* Справа места не оставляем — свои сообщения без аватара */}
    </div>
  );
}

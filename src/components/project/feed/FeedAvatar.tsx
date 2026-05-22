import { cn } from "@/lib/utils";

interface FeedAvatarProps {
  color: string;
  initials: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Кружок-аватар: цветной фон-тинт + контрастный hairline + инициалы цветом.
 * Используется для авторов сообщений и actor-меток в ленте.
 */
export function FeedAvatar({
  color,
  initials,
  size = "md",
  className,
}: FeedAvatarProps) {
  const px = size === "sm" ? "size-6 text-[10px]" : "size-8 text-xs";
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-bold",
        px,
        className,
      )}
      style={{
        backgroundColor: `${color}22`,
        color,
        boxShadow: `inset 0 0 0 1px ${color}55`,
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

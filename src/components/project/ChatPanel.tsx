"use client";

// Чат проекта «Коммуникация» (п. 6 ТЗ) — в стиле современных мессенджеров.
// Идентичен во всех трёх ролях.

import { useEffect, useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import type { ChatMessage, Project, Role } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Side = Role | "platform";

const SIDE_META: Record<Side, { label: string; color: string; initials: string }> = {
  client:     { label: "Заказчик",   color: "#71717a", initials: "З" },
  contractor: { label: "Подрядчик",  color: "#fbbf24", initials: "П" },
  platform:   { label: "Платформа",  color: "#34d399", initials: "S" },
  manager:    { label: "Платформа",  color: "#34d399", initials: "S" },
};

/** Какая сторона является «вами» для текущей роли. */
function selfSide(role: Role): Side {
  return role === "manager" ? "platform" : role;
}

interface ChatPanelProps {
  project: Project;
  role: Role;
}

export function ChatPanel({ project, role }: ChatPanelProps) {
  const sendMessage = useAppStore((s) => s.sendMessage);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const self = selfSide(role);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [project.messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    sendMessage(project.id, text);
    setDraft("");
  };

  return (
    <div className="shadow-card grid overflow-hidden rounded-2xl border bg-card lg:grid-cols-[220px_1fr]">
      {/* Список участников с цветовыми тегами */}
      <aside className="hidden border-r bg-muted/30 p-4 lg:block">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Участники
        </p>
        <ul className="mt-3 space-y-1.5">
          {(["client", "contractor", "platform"] as Side[]).map((side) => {
            const meta = SIDE_META[side];
            const isSelf = side === self;
            return (
              <li
                key={side}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                  isSelf && "bg-card ring-1 ring-border",
                )}
              >
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {meta.label}
                  </span>
                  {isSelf && (
                    <span className="block text-[11px] text-muted-foreground">
                      это вы
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          Встроенный чат проекта. Сообщения менеджера видны как «Платформа».
        </p>
      </aside>

      {/* Лента сообщений */}
      <div className="flex min-h-[460px] flex-col">
        <div
          ref={scrollRef}
          className="scroll-slim flex-1 space-y-4 overflow-y-auto bg-background p-5"
          style={{ maxHeight: 460 }}
        >
          {project.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isSelf={message.authorRole === self}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 border-t bg-card p-3">
          <button
            type="button"
            aria-label="Прикрепить файл"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Paperclip className="size-5" />
          </button>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder="Напишите сообщение…"
            className="h-10 flex-1 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
          <Button
            className="h-10"
            onClick={send}
            disabled={draft.trim().length === 0}
          >
            <Send className="size-4" />
            Отправить
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isSelf,
}: {
  message: ChatMessage;
  isSelf: boolean;
}) {
  const meta = SIDE_META[message.authorRole];
  const isPlatform =
    message.authorRole === "platform" || message.authorRole === "manager";

  return (
    <div
      className={cn(
        "flex items-end gap-2.5",
        isSelf ? "flex-row-reverse" : "flex-row",
      )}
    >
      <span
        className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: meta.color }}
        aria-hidden
      >
        {meta.initials}
      </span>
      <div className={cn("max-w-[78%]", isSelf ? "items-end" : "items-start")}>
        <div
          className={cn(
            "flex items-center gap-2",
            isSelf ? "justify-end" : "justify-start",
          )}
        >
          <span
            className="text-xs font-semibold"
            style={{ color: meta.color }}
          >
            {message.authorName}
          </span>
          {isPlatform && (
            <span className="rounded-full bg-[#34d399]/12 px-1.5 py-0.5 text-[10px] font-semibold text-[#34d399]">
              Платформа
            </span>
          )}
        </div>
        <div
          className={cn(
            "mt-1 rounded-2xl px-3.5 py-2 text-sm",
            isSelf
              ? "rounded-br-sm bg-[#fafafa] text-[#0a0a0c]"
              : isPlatform
                ? "rounded-bl-sm border border-[#34d399]/20 bg-[#34d399]/8 text-foreground"
                : "rounded-bl-sm border bg-card",
          )}
        >
          {message.text}
        </div>
        <p
          className={cn(
            "mt-1 text-[11px] text-muted-foreground",
            isSelf ? "text-right" : "text-left",
          )}
        >
          {message.time}
        </p>
      </div>
    </div>
  );
}

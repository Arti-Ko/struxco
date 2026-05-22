"use client";

import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedComposerProps {
  onSend: (text: string) => void;
  placeholder?: string;
}

/**
 * Поле ввода сообщения внизу ленты — заменяет нижнюю часть старого ChatPanel.
 * Enter без Shift → отправка.
 */
export function FeedComposer({ onSend, placeholder }: FeedComposerProps) {
  const [draft, setDraft] = useState("");
  const disabled = draft.trim().length === 0;

  const submit = () => {
    if (disabled) return;
    onSend(draft.trim());
    setDraft("");
  };

  return (
    <div
      className="flex items-center gap-2 rounded-lg p-2"
      style={{
        background: "#141416",
        border: "1px solid #26262a",
      }}
    >
      <button
        type="button"
        aria-label="Прикрепить файл"
        className="grid size-9 shrink-0 place-items-center rounded-md transition"
        style={{ color: "#7d7d80" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ededed")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#7d7d80")}
      >
        <Paperclip className="size-4" />
      </button>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder ?? "Напишите сообщение в ленту проекта…"}
        className="h-9 flex-1 rounded-md bg-transparent px-2 text-sm outline-none"
        style={{ color: "#ededed" }}
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition",
          disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
        )}
        style={{
          background: "#fafafa",
          color: "#0a0a0c",
        }}
      >
        <Send className="size-3.5" />
        Отправить
      </button>
    </div>
  );
}

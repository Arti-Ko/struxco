"use client";

// Колокольчик уведомлений в шапке — счётчик + список «требует внимания».
// Визуальное уведомление внутри интерфейса (п. 7 ТЗ).

import { Bell, ChevronRight } from "lucide-react";
import { roleNotices } from "@/lib/notifications";
import { useAppStore } from "@/store/useAppStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationsBell() {
  const role = useAppStore((s) => s.role);
  const projects = useAppStore((s) => s.projects);
  const openProject = useAppStore((s) => s.openProject);

  const notices = roleNotices(projects, role);
  const count = notices.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative grid size-9 place-items-center rounded-lg transition focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
        style={{ color: "#7d7d80" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ededed"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#7d7d80"; }}
        aria-label={`Уведомления: ${count}`}
      >
        <Bell className="size-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#fbbf24] px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[340px] p-0"
      >
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Уведомления</p>
          <p className="text-xs text-muted-foreground">
            {count > 0
              ? `${count} событий требуют вашего внимания`
              : "Новых событий нет"}
          </p>
        </div>

        {count === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Все задачи в этой роли выполнены.
          </div>
        ) : (
          <ul className="scroll-slim max-h-[60vh] overflow-y-auto py-1.5">
            {notices.map((notice, index) => (
              <li key={`${notice.projectId}-${index}`}>
                <button
                  type="button"
                  onClick={() => openProject(notice.projectId, notice.tab)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-muted"
                >
                  <span
                    className="mt-1 size-2 shrink-0 self-start rounded-full bg-[#fbbf24]"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {notice.text}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {notice.projectName}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

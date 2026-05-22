"use client";

// Шапка приложения: логотип, переключатель ролей, уведомления, профиль роли.

import { LogOut } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ROLE_SUBTITLE } from "@/lib/statuses";
import type { Role } from "@/lib/types";
import { CONTRACTORS, CURRENT_CONTRACTOR_ID } from "@/store/seed";
import { useAppStore } from "@/store/useAppStore";
import { NotificationsBell } from "./NotificationsBell";
import { RoleSwitcher } from "./RoleSwitcher";

interface Identity {
  name: string;
  org: string;
  initials: string;
}

function identityForRole(role: Role): Identity {
  if (role === "client") {
    return { name: "Анна Котова", org: "ООО «Вертикаль»", initials: "АК" };
  }
  if (role === "contractor") {
    const me = CONTRACTORS.find((c) => c.id === CURRENT_CONTRACTOR_ID)!;
    return { name: me.contactPerson, org: me.name, initials: "ДО" };
  }
  return { name: "Игорь Лебедев", org: "Платформа Struxco", initials: "ИЛ" };
}

export function AppHeader() {
  const role = useAppStore((s) => s.role);
  const logout = useAppStore((s) => s.logout);
  const goToDashboard = useAppStore((s) => s.goToDashboard);

  const identity = identityForRole(role);

  return (
    <header className="sticky top-0 z-40" style={{ background: "rgba(10,10,12,0.88)", borderBottom: "1px solid #26262a", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-4 px-5 lg:px-8">
        <button
          type="button"
          onClick={goToDashboard}
          className="shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
          aria-label="На главную"
        >
          <Logo onDark />
        </button>

        <div className="mx-auto">
          <RoleSwitcher />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <NotificationsBell />

          <div className="mx-1 hidden h-8 w-px md:block" style={{ background: "#26262a" }} />

          <div className="hidden items-center gap-2.5 md:flex">
            <span
              className="grid size-9 place-items-center rounded-full text-sm font-semibold text-white"
              style={{ background: "#26262a", border: "1px solid #3a3a3f" }}
            >
              {identity.initials}
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-white">
                {identity.name}
              </span>
              <span className="block text-[11px] text-white/55">
                {ROLE_SUBTITLE[role]} · {identity.org}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Выйти"
            className="grid size-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

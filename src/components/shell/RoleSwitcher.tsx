"use client";

import { Hammer, ShieldCheck, User } from "lucide-react";
import type { Role } from "@/lib/types";
import { ROLE_LABEL } from "@/lib/statuses";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const ROLES: { role: Role; icon: typeof User }[] = [
  { role: "client", icon: User },
  { role: "contractor", icon: Hammer },
  { role: "manager", icon: ShieldCheck },
];

export function RoleSwitcher() {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg p-1"
      style={{ background: "#141416", border: "1px solid #26262a" }}
      role="tablist"
      aria-label="Переключатель ролей"
    >
      {ROLES.map(({ role: r, icon: Icon }) => {
        const active = r === role;
        return (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setRole(r)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-all duration-100",
            )}
            style={
              active
                ? {
                    background: "#1c1c1f",
                    border: "1px solid #3a3a3f",
                    color: "#ededed",
                  }
                : {
                    border: "1px solid transparent",
                    color: "#7d7d80",
                  }
            }
            onMouseEnter={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.color = "#ededed";
            }}
            onMouseLeave={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.color = "#7d7d80";
            }}
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{ROLE_LABEL[r]}</span>
          </button>
        );
      })}
    </div>
  );
}

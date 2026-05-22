"use client";

import { useState } from "react";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";

const HIGHLIGHTS = [
  "Полный жизненный цикл проекта — от ТЗ до финальной выплаты",
  "Закрытый тендер: подрядчиков подбирает менеджер платформы",
  "Оплата этапов через эскроу — клиент платит за результат",
];

export function LoginScreen() {
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState("a.kotova@vertikal.ru");
  const [password, setPassword] = useState("demo-2026");

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
      {/* Left panel — brand */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{
          background: "linear-gradient(160deg, #0a0a0c 0%, #141416 50%, #0a0a0c 100%)",
          backgroundImage: `
            linear-gradient(160deg, #0a0a0c 0%, #141416 50%, #0a0a0c 100%),
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 96px 96px, 96px 96px",
          backgroundBlendMode: "normal",
        }}
      >
        {/* Atmospheric wash — top left, very subtle */}
        <div
          className="pointer-events-none absolute -top-24 -left-16 size-[520px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.05) 0%, transparent 55%)",
            filter: "blur(2px)",
          }}
          aria-hidden
        />
        {/* Subtle bottom vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 110%, rgba(10,10,12,0.7) 0%, transparent 60%)",
          }}
          aria-hidden
        />

        <Logo onDark />

        <div className="relative max-w-md">
          {/* Eyebrow */}
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "1.25rem",
            }}
          >
            B2B управление стройпроектами
          </p>

          {/* Editorial headline */}
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#ededed",
            }}
          >
            Clarity
            <br />
            <span style={{ color: "rgba(255,255,255,0.45)" }}>in</span>
            <br />
            Complexity
          </h1>

          {/* Benefits list */}
          <ul className="mt-9 space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3.5">
                <span
                  className="mt-1 size-5 shrink-0 rounded-full grid place-items-center"
                  style={{
                    background: "rgba(52,211,153,0.08)",
                    boxShadow: "0 0 0 1px rgba(52,211,153,0.22), 0 0 10px rgba(52,211,153,0.08)",
                  }}
                >
                  <span className="size-1.5 rounded-full bg-[#34d399]" />
                </span>
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* Trust block */}
          <div
            className="mt-10 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                marginBottom: "0.625rem",
              }}
            >
              Центральная ценность
            </p>
            <p
              style={{
                fontSize: "2.25rem",
                fontWeight: 200,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Доверие
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p
          className="relative flex items-center gap-2 text-xs"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          <ShieldCheck className="size-4" />
          Кликабельный прототип · демо-данные · NDA
        </p>
      </aside>

      {/* Right panel — form */}
      <main
        className="flex items-center justify-center px-6 py-12"
        style={{
          background: "#0a0a0c",
          borderLeft: "1px solid #26262a",
        }}
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Logo onDark />
          </div>

          {/* Form header */}
          <div className="mb-8">
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "0.625rem",
              }}
            >
              Личный кабинет
            </p>
            <h2
              className="text-[1.75rem] font-semibold"
              style={{ letterSpacing: "-0.03em", color: "#ededed" }}
            >
              Вход в систему
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#7d7d80" }}>
              Войдите в личный кабинет платформы Struxco.
            </p>
          </div>

          {/* Form */}
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="login-email" style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>
                Логин
              </Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                autoComplete="username"
                style={{
                  background: "#141416",
                  border: "1px solid #26262a",
                  color: "#ededed",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password" style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>
                Пароль
              </Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                autoComplete="current-password"
                style={{
                  background: "#141416",
                  border: "1px solid #26262a",
                  color: "#ededed",
                }}
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full text-sm font-semibold"
              style={{
                background: "#fafafa",
                borderRadius: "6px",
                border: "none",
                color: "#0a0a0c",
                boxShadow: "0 1px 0 rgba(255,255,255,0.15) inset, 0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Войти
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Demo note */}
          <div
            className="mt-6 flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-xs"
            style={{
              border: "1px solid #26262a",
              background: "#141416",
              color: "#7d7d80",
            }}
          >
            <Lock className="mt-0.5 size-3.5 shrink-0" style={{ color: "#fafafa" }} />
            <span>
              Демо-режим: авторизация не выполняется. После входа роль (Клиент /
              Подрядчик / Менеджер) переключается в шапке.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

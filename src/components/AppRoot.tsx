"use client";

import { useAppStore } from "@/store/useAppStore";
import { AppHeader } from "@/components/shell/AppHeader";
import { LoginScreen } from "@/components/login/LoginScreen";
import { ClientDashboard } from "@/components/client/ClientDashboard";
import { CreateProjectForm } from "@/components/client/CreateProjectForm";
import { ClientProjectView } from "@/components/client/ClientProjectView";
import { ContractorDashboard } from "@/components/contractor/ContractorDashboard";
import { ContractorProjectView } from "@/components/contractor/ContractorProjectView";
import { ManagerDashboard } from "@/components/manager/ManagerDashboard";
import { ManagerProjectView } from "@/components/manager/ManagerProjectView";

function ScreenRouter() {
  const role = useAppStore((s) => s.role);
  const screen = useAppStore((s) => s.screen);
  const projects = useAppStore((s) => s.projects);

  if (screen.name === "create") return <CreateProjectForm />;

  if (screen.name === "project") {
    const project = projects.find((p) => p.id === screen.projectId);
    if (!project) return <ClientDashboard />;
    if (role === "client") return <ClientProjectView project={project} />;
    if (role === "contractor") return <ContractorProjectView project={project} />;
    return <ManagerProjectView project={project} />;
  }

  if (role === "client") return <ClientDashboard />;
  if (role === "contractor") return <ContractorDashboard />;
  return <ManagerDashboard />;
}

export function AppRoot() {
  const loggedIn = useAppStore((s) => s.loggedIn);

  if (!loggedIn) return <LoginScreen />;

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-8 lg:px-8 lg:py-10">
        <ScreenRouter />
      </main>
      <footer style={{ borderTop: "1px solid #26262a" }}>
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs lg:px-8" style={{ color: "#7d7d80" }}>
          <span>Struxco · B2B-платформа управления стройпроектами</span>
          <span>Демо-данные · бэкенд не используется</span>
        </div>
      </footer>
    </div>
  );
}

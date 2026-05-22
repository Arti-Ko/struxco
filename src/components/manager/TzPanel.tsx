"use client";

// Панель ТЗ для менеджера: просмотр/редактирование полей, открытие тендера.

import { useState } from "react";
import { CheckCircle2, Edit3, FileText, Save, X } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatBudgetRange, formatDate } from "@/lib/format";
import type { Project } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

interface TzPanelProps {
  project: Project;
}

export function TzPanel({ project }: TzPanelProps) {
  const managerOpenTender = useAppStore((s) => s.managerOpenTender);
  const managerUpdateTz = useAppStore((s) => s.managerUpdateTz);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [budgetFrom, setBudgetFrom] = useState(String(project.budgetFrom));
  const [budgetTo, setBudgetTo] = useState(String(project.budgetTo));
  const [desiredStart, setDesiredStart] = useState(project.desiredStart);
  const [desiredEnd, setDesiredEnd] = useState(project.desiredEnd);

  const save = () => {
    managerUpdateTz(project.id, {
      name: name.trim() || project.name,
      description: description.trim() || project.description,
      budgetFrom: Number(budgetFrom) || project.budgetFrom,
      budgetTo: Number(budgetTo) || project.budgetTo,
      desiredStart: desiredStart || project.desiredStart,
      desiredEnd: desiredEnd || project.desiredEnd,
    });
    setEditing(false);
  };

  const cancel = () => {
    setName(project.name);
    setDescription(project.description);
    setBudgetFrom(String(project.budgetFrom));
    setBudgetTo(String(project.budgetTo));
    setDesiredStart(project.desiredStart);
    setDesiredEnd(project.desiredEnd);
    setEditing(false);
  };

  return (
    <Panel
      icon={FileText}
      title="Техническое задание"
      description="ТЗ от клиента — проверьте и при необходимости скорректируйте"
      action={
        !editing ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setEditing(true)}
          >
            <Edit3 className="size-3.5" />
            Редактировать
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={cancel}
            >
              <X className="size-3.5" />
              Отмена
            </Button>
            <Button
              size="sm"
              className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={save}
            >
              <Save className="size-3.5" />
              Сохранить
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-5 p-5">
        {editing ? (
          <>
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Бюджет от, ₽</Label>
                <Input
                  type="number"
                  value={budgetFrom}
                  onChange={(e) => setBudgetFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Бюджет до, ₽</Label>
                <Input
                  type="number"
                  value={budgetTo}
                  onChange={(e) => setBudgetTo(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Начало</Label>
                <Input
                  type="date"
                  value={desiredStart}
                  onChange={(e) => setDesiredStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Окончание</Label>
                <Input
                  type="date"
                  value={desiredEnd}
                  onChange={(e) => setDesiredEnd(e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Название проекта
              </p>
              <p className="mt-0.5 font-medium">{project.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Описание задачи
              </p>
              <p className="mt-0.5 text-sm leading-relaxed">{project.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Бюджет клиента
                </p>
                <p className="mt-0.5 font-semibold">
                  {formatBudgetRange(project.budgetFrom, project.budgetTo)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Желаемые сроки
                </p>
                <p className="mt-0.5 font-semibold">
                  {formatDate(project.desiredStart)} —{" "}
                  {formatDate(project.desiredEnd)}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Open tender button */}
        {project.status === "draft" && !editing && (
          <div className="rounded-xl border border-[#fafafa]/20 bg-[#fafafa]/6 p-4">
            <p className="mb-3 text-sm font-medium text-[#ededed]">
              ТЗ проверено и готово к тендеру. Нажмите кнопку — платформа
              пригласит 2 проверенных подрядчика и запустит сбор КП.
            </p>
            <Button
              className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => managerOpenTender(project.id)}
            >
              <CheckCircle2 className="size-4" />
              Открыть тендер
            </Button>
          </div>
        )}

        {project.status !== "draft" && (
          <div className="flex items-center gap-2 rounded-xl border border-[#34d399]/20 bg-[#34d399]/8 px-4 py-3 text-sm font-medium text-[#34d399]">
            <CheckCircle2 className="size-4 shrink-0" />
            ТЗ согласовано. Тендер открыт.
          </div>
        )}
      </div>
    </Panel>
  );
}

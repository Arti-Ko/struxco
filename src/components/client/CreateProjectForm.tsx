"use client";

// Форма создания нового ТЗ (п. 5.1 ТЗ).

import { useState } from "react";
import { ArrowLeft, FolderPlus, Info } from "lucide-react";
import { PageHeading } from "@/components/shared/PageHeading";
import { FileDropzone } from "@/components/project/FileDropzone";
import { Button } from "@/components/ui/button";

const TZ_SAMPLES = [
  "ТЗ_проект.pdf",
  "Планировка.pdf",
  "Смета_предварительная.xlsx",
  "Фото_объекта.jpg",
  "Техническое_задание.docx",
];
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/useAppStore";

export function CreateProjectForm() {
  const createProject = useAppStore((s) => s.createProject);
  const goToDashboard = useAppStore((s) => s.goToDashboard);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [desiredStart, setDesiredStart] = useState("");
  const [desiredEnd, setDesiredEnd] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const canSubmit =
    name.trim() &&
    description.trim() &&
    Number(budgetFrom) > 0 &&
    Number(budgetTo) >= Number(budgetFrom) &&
    desiredStart &&
    desiredEnd;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createProject({
      name: name.trim(),
      description: description.trim(),
      budgetFrom: Number(budgetFrom),
      budgetTo: Number(budgetTo),
      desiredStart,
      desiredEnd,
      fileNames: files,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={goToDashboard}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Мои проекты
        </button>
        <div className="mt-3">
          <PageHeading
            title="Новый проект"
            subtitle="Опишите задачу — менеджер изучит детали и откроет тендер среди проверенных подрядчиков"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main form */}
        <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-card">
          <div className="space-y-2">
            <Label htmlFor="proj-name">Название проекта *</Label>
            <Input
              id="proj-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ремонт офиса под ключ, ул. Лесная 7"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proj-desc">Описание задачи *</Label>
            <Textarea
              id="proj-desc"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробно опишите объём работ: площадь, виды работ, материалы, особые требования…"
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget-from">Бюджет от, ₽ *</Label>
              <Input
                id="budget-from"
                type="number"
                min={0}
                value={budgetFrom}
                onChange={(e) => setBudgetFrom(e.target.value)}
                placeholder="1 500 000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-to">Бюджет до, ₽ *</Label>
              <Input
                id="budget-to"
                type="number"
                min={0}
                value={budgetTo}
                onChange={(e) => setBudgetTo(e.target.value)}
                placeholder="2 500 000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Желаемое начало *</Label>
              <Input
                id="start"
                type="date"
                value={desiredStart}
                onChange={(e) => setDesiredStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">Желаемое окончание *</Label>
              <Input
                id="end"
                type="date"
                value={desiredEnd}
                onChange={(e) => setDesiredEnd(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* File dropzone */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <p className="mb-3 text-sm font-semibold">
              Техническое задание{" "}
              <span className="font-normal text-muted-foreground">
                (необязательно)
              </span>
            </p>
            <FileDropzone
              files={files}
              samples={TZ_SAMPLES}
              onAdd={(name) => setFiles((prev) => [...prev, name])}
              onRemove={(index) =>
                setFiles((prev) => prev.filter((_, i) => i !== index))
              }
              label="Перетащите файлы или нажмите"
              hint="PDF, фото, таблицы — до 5 файлов"
              maxFiles={5}
            />
          </div>

          {/* Hint */}
          <div className="flex items-start gap-3 rounded-xl border border-[#fafafa]/20 bg-[#fafafa]/6 p-4 text-sm text-[#ededed]">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>
              После отправки менеджер платформы изучит ТЗ в течение рабочего
              дня и откроет закрытый тендер — вы получите 2 КП от проверенных
              подрядчиков.
            </p>
          </div>

          {/* Submit */}
          <Button
            className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            <FolderPlus className="size-4" />
            Отправить менеджеру
          </Button>
        </div>
      </div>
    </div>
  );
}

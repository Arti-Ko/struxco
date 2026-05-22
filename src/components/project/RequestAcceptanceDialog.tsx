"use client";

// Модальное окно подрядчика «Запросить приёмку» (п. 5.3 ТЗ): загрузка
// фото/видео-отчёта или акта через drag&drop + отправка на проверку.

import { useState } from "react";
import { ClipboardCheck, Send } from "lucide-react";
import type { Stage } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileDropzone } from "./FileDropzone";

const REPORT_SAMPLES = [
  "Фото_объект_до.jpg",
  "Фото_объект_после.jpg",
  "Видео_обход_этапа.mp4",
  "Акт_выполненных_работ.pdf",
];

interface RequestAcceptanceDialogProps {
  projectId: string;
  stage: Stage;
  /** Подпись кнопки-триггера зависит от статуса этапа. */
  triggerLabel: string;
}

export function RequestAcceptanceDialog({
  projectId,
  stage,
  triggerLabel,
}: RequestAcceptanceDialogProps) {
  const requestAcceptance = useAppStore((s) => s.requestAcceptance);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const submit = () => {
    if (files.length === 0) return;
    requestAcceptance(projectId, stage.id, files);
    setOpen(false);
    setFiles([]);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="h-9 bg-[#fbbf24] text-[#0b1520] hover:bg-[#f59e0b]"
          />
        }
      >
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Запрос приёмки этапа</DialogTitle>
          <DialogDescription>{stage.name}</DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2.5 rounded-xl border border-[#fbbf24]/25 bg-[#fbbf24]/8 p-3.5 text-sm text-[#fbbf24]">
          <ClipboardCheck className="mt-0.5 size-4.5 shrink-0" />
          <p>
            Приложите фото/видео-отчёт или акт. Менеджер платформы проверит
            результат и передаст клиенту на подтверждение.
          </p>
        </div>

        <div>
          <Label className="mb-2">Отчёт по этапу</Label>
          <FileDropzone
            files={files}
            samples={REPORT_SAMPLES}
            onAdd={(name) => setFiles((prev) => [...prev, name])}
            onRemove={(index) =>
              setFiles((prev) => prev.filter((_, i) => i !== index))
            }
            label="Перетащите файлы сюда или нажмите"
            hint="Фото, видео, PDF-акт — до 5 файлов"
          />
        </div>

        <div>
          <Label htmlFor="acceptance-comment" className="mb-2">
            Комментарий (необязательно)
          </Label>
          <Textarea
            id="acceptance-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Кратко опишите выполненные работы…"
            className="min-h-16"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <DialogClose render={<Button variant="outline" className="h-10" />}>
            Отмена
          </DialogClose>
          <Button
            className="h-10 bg-[#fbbf24] text-[#0b1520] hover:bg-[#f59e0b]"
            disabled={files.length === 0}
            onClick={submit}
          >
            <Send className="size-4" />
            Отправить на проверку
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

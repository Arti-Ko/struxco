"use client";

// Декоративная зона drag&drop загрузки файлов. Реальной загрузки нет:
// клик или «перетаскивание» добавляет мок-файл из набора образцов.

import { useState } from "react";
import { FileText, Plus, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  files: string[];
  samples: string[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
  label: string;
  hint?: string;
  maxFiles?: number;
}

export function FileDropzone({
  files,
  samples,
  onAdd,
  onRemove,
  label,
  hint,
  maxFiles = 5,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const full = files.length >= maxFiles;

  const addMockFile = () => {
    if (full) return;
    const sample = samples[files.length % samples.length];
    const dot = sample.lastIndexOf(".");
    const name =
      files.includes(sample) && dot > 0
        ? `${sample.slice(0, dot)}_${files.length + 1}${sample.slice(dot)}`
        : sample;
    onAdd(name);
  };

  return (
    <div>
      {!full && (
        <button
          type="button"
          onClick={addMockFile}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addMockFile();
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
            dragging
              ? "border-[#fafafa] bg-[#fafafa]/6"
              : "border-border bg-muted/40 hover:border-[#fafafa]/50 hover:bg-muted",
          )}
        >
          <UploadCloud className="size-6 text-[#a1a1aa]" />
          <span className="text-sm font-medium">{label}</span>
          {hint && (
            <span className="text-xs text-muted-foreground">{hint}</span>
          )}
        </button>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2"
            >
              <FileText className="size-4 shrink-0 text-[#a1a1aa]" />
              <span className="min-w-0 flex-1 truncate text-sm">{name}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Удалить ${name}`}
                className="shrink-0 rounded p-0.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {full && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Plus className="size-3" />
          Достигнут лимит файлов ({maxFiles}).
        </p>
      )}
    </div>
  );
}

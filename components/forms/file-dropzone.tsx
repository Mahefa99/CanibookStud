"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { FEATURES } from "@/lib/config/features";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  required?: boolean;
}

/**
 * Local-only file picker for the preview. Files are kept in React state for the
 * session and never uploaded: `FEATURES.uploads.enabled` is false. The input
 * remains a real, focusable control even though the visual surface is custom.
 */
export function FileDropzone({
  id,
  label,
  hint,
  error,
  files,
  onChange,
  accept = FEATURES.uploads.acceptedTypes.join(","),
  maxFiles = 1,
  required,
}: FileDropzoneProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    setLocalError(null);
    const accepted: File[] = [];
    const issues: string[] = [];

    Array.from(incoming).forEach((file) => {
      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      if (!FEATURES.uploads.acceptedTypes.includes(extension)) {
        issues.push(`${file.name}: use PDF, JPG or PNG.`);
        return;
      }
      if (file.size > FEATURES.uploads.maxFileSizeMb * 1024 * 1024) {
        issues.push(`${file.name}: larger than ${FEATURES.uploads.maxFileSizeMb} MB.`);
        return;
      }
      accepted.push(file);
    });

    const next = [...files, ...accepted].slice(0, maxFiles);
    if (files.length + accepted.length > maxFiles) {
      issues.push(`Only ${maxFiles} file${maxFiles === 1 ? "" : "s"} can be attached here.`);
    }
    if (accepted.length > 0) onChange(next);
    if (issues.length > 0) setLocalError(issues.join(" "));
  }

  function removeFile(index: number) {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  }

  const describedBy = [hint ? `${inputId}-hint` : null, error ? `${inputId}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label htmlFor={inputId} className="field-label">
        {label}
        {required ? (
          <span className="ml-1 text-orange-700" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "relative rounded-xl border border-dashed bg-cream-50 p-4 transition-colors focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-navy-700",
          dragging ? "border-navy-600 bg-navy-50" : "border-[#C9BFB0]",
          error ? "border-danger-600" : "",
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          className="sr-only"
          aria-invalid={error || localError ? true : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-navy-700 shadow-sm">
            <Icon name="file" className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <label
              htmlFor={inputId}
              className="cursor-pointer text-sm font-semibold text-navy-800 underline decoration-navy-200 underline-offset-4 hover:decoration-navy-700"
            >
              Choose a file
            </label>
            <p className="text-xs text-muted">or drag and drop · PDF, JPG or PNG · max 10 MB</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted">{FEATURES.uploads.note}</p>
      </div>

      {files.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.lastModified}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-3 py-2 text-xs"
            >
              <span className="min-w-0 truncate text-ink">
                {file.name}{" "}
                <span className="text-muted">({Math.max(1, Math.round(file.size / 1024))} KB)</span>
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="shrink-0 rounded p-1 text-muted hover:bg-danger-50 hover:text-danger-700"
                aria-label={`Remove ${file.name}`}
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {hint ? (
        <p id={`${inputId}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="field-error">
          <Icon name="warning" className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
      {localError ? (
        <p className="field-error" role="alert">
          <Icon name="warning" className="mt-px h-3.5 w-3.5 shrink-0" />
          {localError}
        </p>
      ) : null}
    </div>
  );
}

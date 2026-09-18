"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/cn";

type DialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "default" | "detail";
};

export function Dialog({
  children,
  onClose,
  open,
  size = "default",
  title,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = `${useId().replaceAll(":", "")}-dialog-title`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-dialog-close]")?.focus();
    }

    if (!open && dialog.open) {
      dialog.close();
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  return (
    <dialog
      aria-labelledby={titleId}
      className={cn(
        "w-[calc(100%-32px)] rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-0 text-[hsl(var(--color-text))] shadow-2xl backdrop:bg-black/40",
        size === "detail" ? "max-w-[760px]" : "max-w-[480px]",
      )}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      ref={dialogRef}
    >
      <div className="flex items-start justify-between gap-4 border-b border-[hsl(var(--color-border))] px-5 py-4">
        <h2 className="text-base font-semibold" id={titleId}>
          {title}
        </h2>
        <button
          aria-label="Tutup dialog"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[hsl(var(--color-muted))] transition-colors hover:bg-[hsl(var(--color-primary-soft))] hover:text-[hsl(var(--color-text))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))]"
          data-dialog-close
          onClick={onClose}
          title="Tutup dialog"
          type="button"
        >
          <X aria-hidden size={17} />
        </button>
      </div>
      <div className="max-h-[calc(100vh-180px)] overflow-y-auto px-5 py-5">{children}</div>
    </dialog>
  );
}

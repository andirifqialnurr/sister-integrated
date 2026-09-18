"use client";

import { CircleHelp } from "lucide-react";
import { useId, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";

type HelpTipProps = {
  label?: string;
  children: ReactNode;
};

export function HelpTip({ children, label = "Bantuan" }: HelpTipProps) {
  const [open, setOpen] = useState(false);
  const tipId = `${useId().replaceAll(":", "")}-help`;
  const containerRef = useRef<HTMLSpanElement>(null);

  function handleBlur(event: FocusEvent<HTMLSpanElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <span className="relative inline-flex" onBlur={handleBlur} ref={containerRef}>
      <button
        aria-controls={tipId}
        aria-expanded={open}
        aria-label={label}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[hsl(var(--color-muted))] transition-colors hover:bg-[hsl(var(--color-primary-soft))] hover:text-[hsl(var(--color-primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))]"
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={handleKeyDown}
        title={label}
        type="button"
      >
        <CircleHelp aria-hidden size={15} />
      </button>
      {open && (
        <span
          className="absolute left-0 top-full z-30 mt-2 w-64 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-3 text-xs leading-5 text-[hsl(var(--color-text))] shadow-lg"
          id={tipId}
          role="tooltip"
        >
          {children}
        </span>
      )}
    </span>
  );
}

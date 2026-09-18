"use client";

import { useEffect, useRef, useState } from "react";

import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  ariaLabel?: string;
  disabled?: boolean;
  id?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value: string;
};

export function Select({
  ariaLabel,
  disabled,
  id,
  onValueChange,
  options,
  placeholder = "Pilih",
  value,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex h-10 w-full min-w-[180px] items-center justify-between gap-3 rounded-lg border border-[hsl(var(--color-border))] bg-white px-3 text-left text-sm text-[hsl(var(--color-text))] outline-none transition-colors focus:border-[hsl(var(--color-primary))] focus:ring-2 focus:ring-[hsl(var(--color-primary-soft))]",
          disabled && "cursor-not-allowed bg-[hsl(var(--color-canvas))] opacity-70",
        )}
        disabled={disabled}
        id={id}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className={cn("truncate", !selectedOption && "text-[hsl(var(--color-muted))]")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={cn("shrink-0 transition-transform", open && "rotate-180")}
          size={16}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 z-30 mt-2 max-h-72 w-full min-w-[220px] overflow-auto rounded-lg border border-[hsl(var(--color-border))] bg-white p-1 shadow-lg"
          role="listbox"
        >
          {options.map((option) => (
            <button
              aria-selected={option.value === value}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-[hsl(var(--color-primary-soft))]",
                option.value === value
                  ? "font-semibold text-[hsl(var(--color-primary-strong))]"
                  : "text-[hsl(var(--color-text))]",
              )}
              key={option.value}
              onClick={() => {
                onValueChange(option.value);
                setOpen(false);
              }}
              role="option"
              type="button"
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && <Check aria-hidden size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

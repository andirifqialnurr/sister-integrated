"use client";

import {
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export type TabItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

type TabsProps = {
  items: readonly TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel: string;
  children?: ReactNode;
  className?: string;
};

export function Tabs({
  ariaLabel,
  children,
  className,
  items,
  onValueChange,
  value,
}: TabsProps) {
  const baseId = useId().replaceAll(":", "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(
    items.findIndex((item) => item.value === value),
    0,
  );

  function focusTab(index: number) {
    const item = items[index];
    if (!item || item.disabled) return;

    onValueChange(item.value);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;

    if (nextIndex === undefined) return;

    event.preventDefault();
    for (let offset = 0; offset < items.length; offset += 1) {
      const candidate = (nextIndex + offset) % items.length;
      if (!items[candidate]?.disabled) {
        focusTab(candidate);
        return;
      }
    }
  }

  return (
    <div className={cn("min-w-0", className)}>
      <div
        aria-label={ariaLabel}
        className="flex gap-1 overflow-x-auto border-b border-[hsl(var(--color-border))]"
        role="tablist"
      >
        {items.map((item, index) => {
          const isActive = item.value === value;
          const tabId = `${baseId}-tab-${item.value}`;
          const panelId = `${baseId}-panel-${item.value}`;

          return (
            <button
              aria-controls={panelId}
              aria-selected={isActive}
              className={cn(
                "relative min-h-11 whitespace-nowrap px-3 text-sm font-semibold text-[hsl(var(--color-muted))] transition-colors hover:text-[hsl(var(--color-text))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--color-primary))]",
                isActive && "text-[hsl(var(--color-primary))] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[hsl(var(--color-primary))]",
              )}
              disabled={item.disabled}
              id={tabId}
              key={item.value}
              onClick={() => onValueChange(item.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {children && (
        <div
          aria-labelledby={`${baseId}-tab-${items[activeIndex]?.value ?? ""}`}
          id={`${baseId}-panel-${items[activeIndex]?.value ?? ""}`}
          role="tabpanel"
          tabIndex={0}
        >
          {children}
        </div>
      )}
    </div>
  );
}

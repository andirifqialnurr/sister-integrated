import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type StatusTone = "success" | "warning" | "danger" | "neutral";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  success:
    "bg-[hsl(var(--color-success-soft))] text-[hsl(var(--color-success-strong))]",
  warning:
    "bg-[hsl(var(--color-warning-soft))] text-[hsl(var(--color-warning-strong))]",
  danger:
    "bg-[hsl(var(--color-danger-soft))] text-[hsl(var(--color-danger-strong))]",
  neutral:
    "bg-[hsl(var(--color-neutral-soft))] text-[hsl(var(--color-muted))]",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

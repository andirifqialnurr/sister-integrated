import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type StateTone = "loading" | "empty" | "error" | "forbidden" | "unavailable";

type StateProps = {
  title: string;
  description?: string;
  tone?: StateTone;
  action?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

const toneClasses: Record<StateTone, string> = {
  loading: "border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))]",
  empty: "border-dashed border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))]",
  error: "border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))]",
  forbidden: "border-[hsl(var(--color-warning))]/30 bg-[hsl(var(--color-warning-soft))]",
  unavailable: "border-[hsl(var(--color-warning))]/30 bg-[hsl(var(--color-warning-soft))]",
};

export function State({
  title,
  description,
  tone = "empty",
  action,
  children,
  icon,
  className,
}: StateProps) {
  const isLoading = tone === "loading";

  return (
    <section
      aria-busy={isLoading}
      aria-live={isLoading ? "polite" : "assertive"}
      className={cn("rounded-xl border p-10 text-center", toneClasses[tone], className)}
      role={isLoading ? "status" : "region"}
    >
      {icon && (
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-[hsl(var(--color-text))]">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-xl text-xs text-[hsl(var(--color-muted))]">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </section>
  );
}

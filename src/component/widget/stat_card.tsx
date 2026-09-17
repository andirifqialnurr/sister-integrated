import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, helper, icon: Icon }: StatCardProps) {
  return (
    <article className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[hsl(var(--color-muted))]">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[hsl(var(--color-text))]">
            {value}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
          <Icon aria-hidden size={18} />
        </div>
      </div>
      <p className="mt-4 text-xs text-[hsl(var(--color-muted))]">{helper}</p>
    </article>
  );
}

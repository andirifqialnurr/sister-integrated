import { Activity } from "lucide-react";

export function EmptyActivity() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-[hsl(var(--color-border))] bg-[hsl(var(--color-canvas))] px-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
        <Activity aria-hidden size={18} />
      </div>
      <p className="mt-3 text-sm font-semibold text-[hsl(var(--color-text))]">
        Belum ada aktivitas
      </p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-[hsl(var(--color-muted))]">
        Aktivitas operasi SISTER dan audit security akan muncul setelah
        integrasi dikonfigurasi.
      </p>
    </div>
  );
}

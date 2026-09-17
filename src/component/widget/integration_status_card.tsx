import { ArrowUpRight, CircleAlert, ShieldCheck } from "lucide-react";

import { StatusBadge } from "@/component/ui/status_badge";

export function IntegrationStatusCard() {
  return (
    <article
      className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]"
      id="integrasi"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[hsl(var(--color-text))]">
            Koneksi SISTER
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
            Status environment integrasi PT
          </p>
        </div>
        <StatusBadge>Belum dikonfigurasi</StatusBadge>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-[hsl(var(--color-canvas))] p-3">
          <CircleAlert aria-hidden className="text-[hsl(var(--color-warning))]" size={18} />
          <p className="text-xs leading-5 text-[hsl(var(--color-muted))]">
            Credential dan URL SISTER belum dimasukkan. Nilai sensitif hanya
            akan diproses di server.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[hsl(var(--color-muted))]">
          <ShieldCheck aria-hidden className="text-[hsl(var(--color-success))]" size={16} />
          <span>Token tidak diekspos ke browser</span>
        </div>
      </div>

      <button className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary-strong))]">
        Buka checklist konfigurasi
        <ArrowUpRight aria-hidden size={14} />
      </button>
    </article>
  );
}

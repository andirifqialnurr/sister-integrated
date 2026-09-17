import { CircleAlert, RefreshCw, ShieldCheck } from "lucide-react";

import { StatusBadge } from "@/component/ui/status_badge";

export type IntegrationCardState = "loading" | "error" | "fixture" | "ready" | "incomplete";

type IntegrationStatusCardProps = {
  state: IntegrationCardState;
  databaseState?: "configured" | "not_configured";
  onRefresh?: () => void;
};

const stateLabel: Record<IntegrationCardState, string> = {
  loading: "Memeriksa...",
  error: "Belum tersedia",
  fixture: "Fixture mode",
  ready: "Terkonfigurasi",
  incomplete: "Belum lengkap",
};

export function IntegrationStatusCard({
  state,
  databaseState,
  onRefresh,
}: IntegrationStatusCardProps) {
  const isReady = state === "ready";
  const isFixture = state === "fixture";
  const isLoading = state === "loading";

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
        <StatusBadge tone={isReady ? "success" : isFixture ? "warning" : "neutral"}>
          {stateLabel[state]}
        </StatusBadge>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-[hsl(var(--color-canvas))] p-3">
          {isReady ? (
            <ShieldCheck aria-hidden className="text-[hsl(var(--color-success))]" size={18} />
          ) : (
            <CircleAlert aria-hidden className="text-[hsl(var(--color-warning))]" size={18} />
          )}
          <p aria-live="polite" className="text-xs leading-5 text-[hsl(var(--color-muted))]">
            {isLoading && "Status konfigurasi sedang diperiksa."}
            {state === "error" && "Status belum tersedia. Coba periksa ulang dari server."}
            {isFixture && "Development memakai data sintetis; request live belum diaktifkan."}
            {state === "incomplete" &&
              "Konfigurasi live belum lengkap. Credential tetap diproses server-side."}
            {isReady && "Konfigurasi live tersedia; authorize hanya dilakukan saat capability dipanggil."}
          </p>
        </div>
        {databaseState && (
          <div className="text-xs text-[hsl(var(--color-muted))]">
            Database lokal: <span className="font-semibold">{databaseState === "configured" ? "terkonfigurasi" : "belum dikonfigurasi"}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-xs text-[hsl(var(--color-muted))]">
          <ShieldCheck aria-hidden className="text-[hsl(var(--color-success))]" size={16} />
          <span>Token tidak diekspos ke browser</span>
        </div>
      </div>

      <button
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary-strong))] disabled:opacity-50"
        disabled={isLoading}
        onClick={onRefresh}
        type="button"
      >
        <RefreshCw aria-hidden size={14} />
        Periksa ulang status
      </button>
    </article>
  );
}

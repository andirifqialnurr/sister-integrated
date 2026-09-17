import {
  ArrowDownToLine,
  DatabaseZap,
  FileCheck2,
  RefreshCw,
  UsersRound,
} from "lucide-react";

import { Sidebar } from "@/component/ui/sidebar";
import { StatusBadge } from "@/component/ui/status_badge";
import { EmptyActivity } from "@/component/widget/empty_activity";
import { StatCard } from "@/component/widget/stat_card";

import { OverviewStatusWidget } from "../widget/overview_status_widget";

export function OverviewPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--color-border))] bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--color-primary))] text-sm font-black text-white">
              S
            </div>
            <span className="text-sm font-bold text-[hsl(var(--color-text))]">
              SISTER Console
            </span>
          </div>
          <div className="hidden text-xs font-medium text-[hsl(var(--color-muted))] sm:block">
            Integration workspace / Ikhtisar
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge>Development</StatusBadge>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--color-primary-soft))] text-xs font-bold text-[hsl(var(--color-primary-strong))]">
              AD
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] space-y-6 p-5 sm:p-8">
          <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--color-primary))]">
                SISTER Web Service PT
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[hsl(var(--color-text))] sm:text-3xl">
                Selamat datang di workspace integrasi
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--color-muted))]">
                Foundation aplikasi sudah siap. Hubungkan environment SISTER
                setelah credential dan PT tujuan dikonfirmasi.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-[hsl(var(--color-border))] bg-white px-3.5 text-sm font-semibold text-[hsl(var(--color-text))] transition-colors hover:bg-[hsl(var(--color-primary-soft))]">
                <RefreshCw aria-hidden size={15} />
                Sinkronisasi
              </button>
              <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[hsl(var(--color-primary))] px-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[hsl(var(--color-primary-strong))]">
                <ArrowDownToLine aria-hidden size={15} />
                Konfigurasi
              </button>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              helper="Menunggu koneksi SISTER"
              icon={UsersRound}
              label="SDM terindeks"
              value="—"
            />
            <StatCard
              helper="Belum ada operasi eksternal"
              icon={FileCheck2}
              label="Ajuan aktif"
              value="—"
            />
            <StatCard
              helper="Akan diisi setelah health check"
              icon={DatabaseZap}
              label="Sinkronisasi terakhir"
              value="—"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
            <article className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">
                    Aktivitas integrasi
                  </h2>
                  <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                    Ringkasan `sister_operation` dan `security_audit_event`
                  </p>
                </div>
                <StatusBadge>Read-only awal</StatusBadge>
              </div>
              <div className="mt-5">
                <EmptyActivity />
              </div>
            </article>

            <OverviewStatusWidget />
          </section>

          <section className="rounded-xl border border-[hsl(var(--color-primary))]/20 bg-[hsl(var(--color-primary-soft))] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[hsl(var(--color-primary))]">
                <ShieldIcon />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[hsl(var(--color-primary-strong))]">
                  Security boundary aktif sejak foundation
                </h2>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-[hsl(var(--color-primary-strong))]/75">
                  Browser hanya akan menerima session dan DTO yang sudah
                  dipilih. Credential SISTER, bearer token, dan payload
                  sensitif tetap berada di server.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3 5 6v5c0 4.6 2.9 8.4 7 10 4.1-1.6 7-5.4 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m9.5 12 1.7 1.7 3.6-3.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

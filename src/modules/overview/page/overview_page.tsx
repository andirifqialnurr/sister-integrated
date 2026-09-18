"use client";

import {
  ArrowDownToLine,
  DatabaseZap,
  FileCheck2,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/component/ui/button";
import { PageShell } from "@/component/ui/page_shell";
import { StatusBadge } from "@/component/ui/status_badge";
import { EmptyActivity } from "@/component/widget/empty_activity";
import { StatCard } from "@/component/widget/stat_card";
import { useTRPC } from "@/lib/trpc";

import { OverviewStatusWidget } from "../widget/overview_status_widget";

export function OverviewPage() {
  const trpc = useTRPC();
  const sdmCountQuery = useQuery(
    trpc.pegawai.search.queryOptions({ search_by: "nama", search: "", page: 1, per_page: 1 }),
  );
  const sdmCountValue = sdmCountQuery.isPending
    ? "…"
    : sdmCountQuery.isError
      ? "—"
      : sdmCountQuery.data.total.toLocaleString("id-ID");
  const sdmCountHelper = sdmCountQuery.isPending
    ? "Memuat dari /referensi/sdm..."
    : sdmCountQuery.isError
      ? "Pencarian pegawai belum dapat dimuat"
      : `Sumber: ${sdmCountQuery.data.source === "sister" ? "SISTER" : "fixture mode"}`;

  return (
    <PageShell
      actions={
        <>
          <Button variant="secondary">
            <RefreshCw aria-hidden size={15} />
            Sinkronisasi
          </Button>
          <Button>
            <ArrowDownToLine aria-hidden size={15} />
            Konfigurasi
          </Button>
        </>
      }
      breadcrumb={[{ label: "Ikhtisar" }]}
    >

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              helper={sdmCountHelper}
              icon={UsersRound}
              label="SDM terindeks"
              value={sdmCountValue}
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
    </PageShell>
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

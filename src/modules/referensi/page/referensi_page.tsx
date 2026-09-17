"use client";

import Link from "next/link";

import { ArrowLeft, Building2, CalendarDays, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/component/ui/button";
import { Sidebar } from "@/component/ui/sidebar";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { ProfilPtWidget } from "../widget/profil_pt_widget";
import { SemesterTable } from "../widget/semester_table";

export function ReferensiPage() {
  const trpc = useTRPC();
  const profilPtQuery = useQuery(trpc.referensi.get_profil_pt.queryOptions({}));
  const semesterQuery = useQuery(trpc.referensi.get_semester.queryOptions({}));

  return (
    <div className="flex min-h-screen">
      <Sidebar activeLabel="Referensi" />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--color-border))] bg-white px-5 sm:px-8">
          <Link
            className="inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--color-muted))] transition-colors hover:text-[hsl(var(--color-primary))]"
            href="/"
          >
            <ArrowLeft aria-hidden size={15} />
            Kembali ke ikhtisar
          </Link>
          <span className="text-xs font-medium text-[hsl(var(--color-muted))]">
            SISTER Console / Referensi
          </span>
        </header>

        <main className="mx-auto max-w-[1440px] space-y-6 p-5 sm:p-8">
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
                <Building2 aria-hidden size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--color-primary))]">
                  Modul read-only
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--color-text))]">
                  Referensi SISTER
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[hsl(var(--color-muted))]">
              Data identitas perguruan tinggi dan pilihan semester dibaca dari
              endpoint referensi yang terdokumentasi. Tidak ada aksi perubahan
              data pada halaman ini.
            </p>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <article className="min-w-0 rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
              <PanelHeader
                description="GET /referensi/profil_pt · tanpa parameter"
                icon={<Building2 aria-hidden size={17} />}
                onRefresh={() => void profilPtQuery.refetch()}
                source={profilPtQuery.data?.source}
                title="Profil perguruan tinggi"
                isFetching={profilPtQuery.isFetching}
              />
              <div className="p-5">
                {profilPtQuery.isPending && <LoadingState label="Memuat profil PT..." />}
                {profilPtQuery.isError && (
                  <ErrorState label="Profil PT belum dapat dimuat. Periksa session dan koneksi SISTER." />
                )}
                {profilPtQuery.data && profilPtQuery.data.items.length === 0 && (
                  <EmptyState label="Profil PT tidak tersedia dari response SISTER." />
                )}
                {profilPtQuery.data && profilPtQuery.data.items.length > 0 && (
                  <ProfilPtWidget items={profilPtQuery.data.items} />
                )}
              </div>
            </article>

            <article className="min-w-0 rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
              <PanelHeader
                description="GET /referensi/semester · tanpa parameter"
                icon={<CalendarDays aria-hidden size={17} />}
                onRefresh={() => void semesterQuery.refetch()}
                source={semesterQuery.data?.source}
                title="Semester"
                isFetching={semesterQuery.isFetching}
              />
              <div className="p-5">
                {semesterQuery.isPending && <LoadingState label="Memuat semester..." />}
                {semesterQuery.isError && (
                  <ErrorState label="Semester belum dapat dimuat. Periksa session dan koneksi SISTER." />
                )}
                {semesterQuery.data && semesterQuery.data.items.length === 0 && (
                  <EmptyState label="Belum ada semester pada response SISTER." />
                )}
                {semesterQuery.data && semesterQuery.data.items.length > 0 && (
                  <SemesterTable items={semesterQuery.data.items} />
                )}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

function PanelHeader({
  description,
  icon,
  onRefresh,
  source,
  title,
  isFetching,
}: {
  description: string;
  icon: React.ReactNode;
  onRefresh: () => void;
  source?: "fixture" | "sister";
  title: string;
  isFetching: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[hsl(var(--color-border))] p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">{title}</h2>
            {source && <SourceBadge source={source} />}
          </div>
          <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">{description}</p>
        </div>
      </div>
      <Button
        aria-label={`Segarkan ${title}`}
        className="shrink-0"
        disabled={isFetching}
        onClick={onRefresh}
        size="sm"
        variant="secondary"
      >
        <RefreshCw aria-hidden className={isFetching ? "animate-spin" : undefined} size={14} />
        <span className="hidden sm:inline">Segarkan</span>
      </Button>
    </div>
  );
}

function SourceBadge({ source }: { source: "fixture" | "sister" }) {
  return (
    <StatusBadge tone={source === "sister" ? "success" : "warning"}>
      {source === "sister" ? "SISTER" : "Fixture mode"}
    </StatusBadge>
  );
}

function LoadingState({ label }: { label: string }) {
  return <p className="py-10 text-center text-sm text-[hsl(var(--color-muted))]">{label}</p>;
}

function ErrorState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-4 text-sm text-[hsl(var(--color-danger-strong))]">
      {label}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[hsl(var(--color-border))] bg-[hsl(var(--color-canvas))] p-8 text-center text-sm text-[hsl(var(--color-muted))]">
      {label}
    </div>
  );
}

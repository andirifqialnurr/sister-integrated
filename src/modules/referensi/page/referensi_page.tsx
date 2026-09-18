"use client";

import { Building2, CalendarDays, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/component/ui/button";
import { PageShell } from "@/component/ui/page_shell";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { ProfilPtWidget } from "../widget/profil_pt_widget";
import { SemesterTable } from "../widget/semester_table";

export function ReferensiPage() {
  const trpc = useTRPC();
  const profilPtQuery = useQuery(trpc.referensi.get_profil_pt.queryOptions({}));
  const semesterQuery = useQuery(trpc.referensi.get_semester.queryOptions({}));

  return (
    <PageShell
      actions={
        <>
          <Button
            disabled={profilPtQuery.isFetching}
            onClick={() => void profilPtQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            <RefreshCw
              aria-hidden
              className={profilPtQuery.isFetching ? "animate-spin" : undefined}
              size={14}
            />
            Profil PT
          </Button>
          <Button
            disabled={semesterQuery.isFetching}
            onClick={() => void semesterQuery.refetch()}
            size="sm"
            variant="secondary"
          >
            <RefreshCw
              aria-hidden
              className={semesterQuery.isFetching ? "animate-spin" : undefined}
              size={14}
            />
            Semester
          </Button>
        </>
      }
      activeLabel="Referensi"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Referensi" }]}
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <article className="min-w-0 rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
          <PanelHeader
            description="GET /referensi/profil_pt - tanpa parameter"
            icon={<Building2 aria-hidden size={17} />}
            source={profilPtQuery.data?.source}
            title="Profil perguruan tinggi"
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
            description="GET /referensi/semester - tanpa parameter"
            icon={<CalendarDays aria-hidden size={17} />}
            source={semesterQuery.data?.source}
            title="Semester"
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
    </PageShell>
  );
}

function PanelHeader({
  description,
  icon,
  source,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  source?: "fixture" | "sister";
  title: string;
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

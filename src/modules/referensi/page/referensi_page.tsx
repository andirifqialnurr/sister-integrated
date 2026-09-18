"use client";

import { Building2, CalendarDays, MapPin, RefreshCw, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/component/ui/button";
import { PageShell } from "@/component/ui/page_shell";
import { State } from "@/component/ui/state";
import { useTRPC } from "@/lib/trpc";

import { ProfilPtWidget } from "../widget/profil_pt_widget";
import { SemesterTable } from "../widget/semester_table";
import { UnitKerjaExplorerWidget } from "../widget/unit_kerja_explorer_widget";
import { WilayahExplorerWidget } from "../widget/wilayah_explorer_widget";

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
            title="Profil perguruan tinggi"
          />
          <div className="p-5">
            {profilPtQuery.isPending && (
              <State description="Mohon tunggu sebentar." title="Memuat profil PT..." tone="loading" />
            )}
            {profilPtQuery.isError && (
              <State
                description="Periksa session dan koneksi SISTER."
                title="Profil PT belum dapat dimuat"
                tone="error"
              />
            )}
            {profilPtQuery.data && profilPtQuery.data.items.length === 0 && (
              <State description="Profil PT tidak tersedia dari response SISTER." title="Belum ada profil PT" />
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
            title="Semester"
          />
          <div className="p-5">
            {semesterQuery.isPending && (
              <State description="Mohon tunggu sebentar." title="Memuat semester..." tone="loading" />
            )}
            {semesterQuery.isError && (
              <State
                description="Periksa session dan koneksi SISTER."
                title="Semester belum dapat dimuat"
                tone="error"
              />
            )}
            {semesterQuery.data && semesterQuery.data.items.length === 0 && (
              <State description="Belum ada semester pada response SISTER." title="Belum ada semester" />
            )}
            {semesterQuery.data && semesterQuery.data.items.length > 0 && (
              <SemesterTable items={semesterQuery.data.items} />
            )}
          </div>
        </article>
      </section>

      <section className="mt-6 min-w-0 rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
        <PanelHeader
          description="GET /referensi/wilayah - id_level_wilayah 0-3, difilter berdasarkan id_induk_wilayah level sebelumnya"
          icon={<MapPin aria-hidden size={17} />}
          title="Wilayah (referensi bertingkat)"
        />
        <div className="p-5">
          <WilayahExplorerWidget />
        </div>
      </section>

      <section className="mt-6 min-w-0 rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
        <PanelHeader
          description="GET /referensi/unit_kerja - id_perguruan_tinggi dari GET /referensi/perguruan_tinggi"
          icon={<Building aria-hidden size={17} />}
          title="Unit kerja (referensi bertingkat)"
        />
        <div className="p-5">
          <UnitKerjaExplorerWidget />
        </div>
      </section>
    </PageShell>
  );
}

function PanelHeader({
  description,
  icon,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[hsl(var(--color-border))] p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">{title}</h2>
          <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">{description}</p>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, SlidersHorizontal } from "lucide-react";

import { StatusBadge } from "@/component/ui/status_badge";
import { cn } from "@/lib/cn";
import { useTRPC } from "@/lib/trpc";

import { BkdActivityTable } from "./bkd_activity_table";
import { BkdSummaryWidget } from "./bkd_summary_widget";

const emptySdmId = "00000000-0000-4000-8000-000000000000";
const emptySemesterId = "0";

const activityTabs = [
  { key: "pendidikan", label: "Pendidikan" },
  { key: "ajar", label: "Ajar" },
  { key: "tunjang", label: "Tunjang" },
  { key: "pengmas", label: "Pengmas" },
  { key: "penelitian", label: "Penelitian" },
] as const;

type ActivityKey = (typeof activityTabs)[number]["key"];

export function BkdWorkspaceWidget() {
  const trpc = useTRPC();
  const [selectedSdmId, setSelectedSdmId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [activeTab, setActiveTab] = useState<ActivityKey>("pendidikan");
  const hasSelection = Boolean(selectedSdmId && selectedSemesterId);

  const pegawaiQuery = useQuery(
    trpc.pegawai.search.queryOptions({
      search_by: "nama",
      search: "",
      page: 1,
      per_page: 50,
    }),
  );
  const semesterQuery = useQuery(trpc.referensi.get_semester.queryOptions({}));

  const laporanQuery = useQuery({
    ...trpc.bkd.laporan_akhir.queryOptions({ id_sdm: selectedSdmId || emptySdmId }),
    enabled: Boolean(selectedSdmId),
  });
  const pendidikanQuery = useQuery({
    ...trpc.bkd.pendidikan.queryOptions({
      id_sdm: selectedSdmId || emptySdmId,
      id_smt: selectedSemesterId || emptySemesterId,
    }),
    enabled: hasSelection && activeTab === "pendidikan",
  });
  const ajarQuery = useQuery({
    ...trpc.bkd.ajar.queryOptions({
      id_sdm: selectedSdmId || emptySdmId,
      id_smt: selectedSemesterId || emptySemesterId,
    }),
    enabled: hasSelection && activeTab === "ajar",
  });
  const tunjangQuery = useQuery({
    ...trpc.bkd.tunjang.queryOptions({
      id_sdm: selectedSdmId || emptySdmId,
      id_smt: selectedSemesterId || emptySemesterId,
    }),
    enabled: hasSelection && activeTab === "tunjang",
  });
  const pengmasQuery = useQuery({
    ...trpc.bkd.pengmas.queryOptions({
      id_sdm: selectedSdmId || emptySdmId,
      id_smt: selectedSemesterId || emptySemesterId,
    }),
    enabled: hasSelection && activeTab === "pengmas",
  });
  const penelitianQuery = useQuery({
    ...trpc.bkd.penelitian.queryOptions({
      id_sdm: selectedSdmId || emptySdmId,
      id_smt: selectedSemesterId || emptySemesterId,
    }),
    enabled: hasSelection && activeTab === "penelitian",
  });

  const activityQuery = {
    pendidikan: pendidikanQuery,
    ajar: ajarQuery,
    tunjang: tunjangQuery,
    pengmas: pengmasQuery,
    penelitian: penelitianQuery,
  }[activeTab];
  const selectedPegawai = pegawaiQuery.data?.items.find(
    (item) => item.id_sdm === selectedSdmId,
  );

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">Pilih konteks BKD</h2>
              {pegawaiQuery.data?.source && <SourceBadge source={pegawaiQuery.data.source} />}
            </div>
            <p className="mt-1 text-xs leading-5 text-[hsl(var(--color-muted))]">
              SDM dan semester dipilih dari referensi SISTER. Tidak ada input UUID atau semester arbitrary.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--color-muted))]">
            <SlidersHorizontal aria-hidden size={14} />
            Read-only
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-semibold text-[hsl(var(--color-text))]" htmlFor="bkd-sdm">
            Pegawai / SDM
            <select
              className="mt-2 h-10 w-full rounded-lg border border-[hsl(var(--color-border))] bg-white px-3 text-sm font-normal text-[hsl(var(--color-text))] outline-none transition-colors focus:border-[hsl(var(--color-primary))] focus:ring-2 focus:ring-[hsl(var(--color-primary-soft))] disabled:cursor-not-allowed disabled:bg-[hsl(var(--color-canvas))]"
              disabled={pegawaiQuery.isPending || pegawaiQuery.isError}
              id="bkd-sdm"
              onChange={(event) => setSelectedSdmId(event.target.value)}
              value={selectedSdmId}
            >
              <option value="">Pilih pegawai</option>
              {pegawaiQuery.data?.items.map((item) => (
                <option key={item.id_sdm} value={item.id_sdm}>
                  {item.nama_sdm} {item.nidn ? `· ${item.nidn}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold text-[hsl(var(--color-text))]" htmlFor="bkd-semester">
            Semester
            <select
              className="mt-2 h-10 w-full rounded-lg border border-[hsl(var(--color-border))] bg-white px-3 text-sm font-normal text-[hsl(var(--color-text))] outline-none transition-colors focus:border-[hsl(var(--color-primary))] focus:ring-2 focus:ring-[hsl(var(--color-primary-soft))] disabled:cursor-not-allowed disabled:bg-[hsl(var(--color-canvas))]"
              disabled={semesterQuery.isPending || semesterQuery.isError}
              id="bkd-semester"
              onChange={(event) => setSelectedSemesterId(event.target.value)}
              value={selectedSemesterId}
            >
              <option value="">Pilih semester</option>
              {semesterQuery.data?.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} ({item.id})
                </option>
              ))}
            </select>
          </label>
        </div>

        {(pegawaiQuery.isPending || semesterQuery.isPending) && (
          <p className="mt-4 text-xs text-[hsl(var(--color-muted))]">Memuat pilihan referensi...</p>
        )}
        {(pegawaiQuery.isError || semesterQuery.isError) && (
          <div className="mt-4 rounded-lg border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-4 text-sm text-[hsl(var(--color-danger-strong))]">
            Pilihan SDM atau semester belum dapat dimuat. Periksa session dan koneksi SISTER.
          </div>
        )}
        {selectedPegawai && selectedSemesterId && (
          <p className="mt-4 text-xs text-[hsl(var(--color-muted))]">
            Konteks aktif: <span className="font-semibold text-[hsl(var(--color-text))]">{selectedPegawai.nama_sdm}</span> · semester {selectedSemesterId}
          </p>
        )}
      </div>

      {!hasSelection && <SelectionState />}

      {hasSelection && (
        <>
          <section className="space-y-4">
            <PanelHeading
              description="GET /bkd/laporan_akhir_bkd · berdasarkan id_sdm"
              source={laporanQuery.data?.source}
              title="Laporan akhir BKD"
            />
            {laporanQuery.isPending && <LoadingState label="Memuat laporan akhir BKD..." />}
            {laporanQuery.isError && <ErrorState label="Laporan akhir BKD belum dapat dimuat." />}
            {laporanQuery.data && laporanQuery.data.items.length === 0 && (
              <EmptyState label="Belum ada laporan akhir BKD untuk SDM ini." />
            )}
            {laporanQuery.data && laporanQuery.data.items.length > 0 && (
              <BkdSummaryWidget items={laporanQuery.data.items} />
            )}
          </section>

          <section className="overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
            <div className="border-b border-[hsl(var(--color-border))] p-5">
              <PanelHeading
                description={`GET /bkd/${activeTab} · id_sdm + id_smt`}
                source={activityQuery.data?.source}
                title="Aktivitas BKD"
              />
              <div className="mt-4 flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Jenis aktivitas BKD">
                {activityTabs.map((tab) => (
                  <button
                    aria-selected={activeTab === tab.key}
                    className={cn(
                      "whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                      activeTab === tab.key
                        ? "bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary-strong))]"
                        : "text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-canvas))] hover:text-[hsl(var(--color-text))]",
                    )}
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    role="tab"
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5">
              {activityQuery.isPending && <LoadingState label={`Memuat data ${activeTab}...`} />}
              {activityQuery.isError && <ErrorState label="Aktivitas BKD belum dapat dimuat." />}
              {activityQuery.data && activityQuery.data.items.length === 0 && (
                <EmptyState label="Belum ada aktivitas pada semester ini." />
              )}
              {activityQuery.data && activityQuery.data.items.length > 0 && (
                <BkdActivityTable items={activityQuery.data.items} />
              )}
            </div>
          </section>
        </>
      )}
    </section>
  );
}

function SourceBadge({ source }: { source: "fixture" | "sister" }) {
  return (
    <StatusBadge tone={source === "sister" ? "success" : "warning"}>
      {source === "sister" ? "SISTER" : "Fixture mode"}
    </StatusBadge>
  );
}

function PanelHeading({
  description,
  source,
  title,
}: {
  description: string;
  source?: "fixture" | "sister";
  title: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
          <BarChart3 aria-hidden size={17} />
        </div>
        <div>
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

function SelectionState() {
  return (
    <div className="rounded-xl border border-dashed border-[hsl(var(--color-border))] bg-white p-10 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
        <SlidersHorizontal aria-hidden size={18} />
      </div>
      <p className="mt-3 text-sm font-semibold text-[hsl(var(--color-text))]">
        Pilih SDM dan semester terlebih dahulu
      </p>
      <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
        Data BKD akan dimuat setelah kedua referensi dipilih.
      </p>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">{label}</div>;
}

function ErrorState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-5 text-sm text-[hsl(var(--color-danger-strong))]">
      {label}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">
      {label}
    </div>
  );
}

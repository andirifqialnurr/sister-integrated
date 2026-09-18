"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, SlidersHorizontal } from "lucide-react";

import { Select } from "@/component/ui/select";
import { State } from "@/component/ui/state";
import { Tabs } from "@/component/ui/tabs";
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

type BkdWorkspaceWidgetProps = {
  sdmId: string;
};

export function BkdWorkspaceWidget({ sdmId }: BkdWorkspaceWidgetProps) {
  const trpc = useTRPC();
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [activeTab, setActiveTab] = useState<ActivityKey>("pendidikan");
  const hasSelection = Boolean(sdmId && selectedSemesterId);

  const semesterQuery = useQuery(trpc.referensi.get_semester.queryOptions({}));

  const laporanQuery = useQuery({
    ...trpc.bkd.laporan_akhir.queryOptions({ id_sdm: sdmId || emptySdmId }),
    enabled: Boolean(sdmId),
  });
  const pendidikanQuery = useQuery({
    ...trpc.bkd.pendidikan.queryOptions({
      id_sdm: sdmId || emptySdmId,
      id_smt: selectedSemesterId || emptySemesterId,
    }),
    enabled: hasSelection && activeTab === "pendidikan",
  });
  const ajarQuery = useQuery({
    ...trpc.bkd.ajar.queryOptions({
      id_sdm: sdmId || emptySdmId,
      id_smt: selectedSemesterId || emptySemesterId,
    }),
    enabled: hasSelection && activeTab === "ajar",
  });
  const tunjangQuery = useQuery({
    ...trpc.bkd.tunjang.queryOptions({
      id_sdm: sdmId || emptySdmId,
      id_smt: selectedSemesterId || emptySemesterId,
    }),
    enabled: hasSelection && activeTab === "tunjang",
  });
  const pengmasQuery = useQuery({
    ...trpc.bkd.pengmas.queryOptions({
      id_sdm: sdmId || emptySdmId,
      id_smt: selectedSemesterId || emptySemesterId,
    }),
    enabled: hasSelection && activeTab === "pengmas",
  });
  const penelitianQuery = useQuery({
    ...trpc.bkd.penelitian.queryOptions({
      id_sdm: sdmId || emptySdmId,
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

  return (
    <section className="space-y-6">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Select
          ariaLabel="Pilih semester"
          disabled={semesterQuery.isPending || semesterQuery.isError}
          onValueChange={setSelectedSemesterId}
          options={[
            { label: "Pilih semester", value: "" },
            ...(semesterQuery.data?.items.map((item) => ({
              label: `${item.nama} (${item.id})`,
              value: String(item.id),
            })) ?? []),
          ]}
          value={selectedSemesterId}
        />
        {semesterQuery.isPending && (
          <p className="text-xs text-[hsl(var(--color-muted))]">Memuat semester...</p>
        )}
      </div>

      {semesterQuery.isError && (
        <State
          description="Periksa session dan koneksi SISTER."
          title="Pilihan semester belum dapat dimuat"
          tone="error"
        />
      )}
      {!hasSelection && (
        <State
          description={
            sdmId
              ? "Data BKD akan dimuat setelah semester dipilih."
              : "Data BKD akan dimuat setelah SDM dan semester dipilih."
          }
          icon={<SlidersHorizontal aria-hidden size={18} />}
          title={sdmId ? "Pilih semester terlebih dahulu" : "Pilih SDM dan semester terlebih dahulu"}
        />
      )}

      {hasSelection && (
        <>
          <section className="space-y-4">
            <PanelHeading
              description="GET /bkd/laporan_akhir_bkd - berdasarkan id_sdm"
              title="Laporan akhir BKD"
            />
            {laporanQuery.isPending && (
              <State description="Mohon tunggu sebentar." title="Memuat laporan akhir BKD..." tone="loading" />
            )}
            {laporanQuery.isError && (
              <State title="Laporan akhir BKD belum dapat dimuat" tone="error" />
            )}
            {laporanQuery.data && laporanQuery.data.items.length === 0 && (
              <State description="Belum ada laporan akhir BKD untuk SDM ini." title="Belum ada laporan akhir BKD" />
            )}
            {laporanQuery.data && laporanQuery.data.items.length > 0 && (
              <BkdSummaryWidget items={laporanQuery.data.items} />
            )}
          </section>

          <section className="overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
            <div className="border-b border-[hsl(var(--color-border))] p-5">
              <PanelHeading
                description={`GET /bkd/${activeTab} - id_sdm + id_smt`}
                title="Aktivitas BKD"
              />
            </div>
            <Tabs
              ariaLabel="Jenis aktivitas BKD"
              className="px-5 pt-3"
              items={activityTabs.map((tab) => ({ value: tab.key, label: tab.label }))}
              onValueChange={(value) => setActiveTab(value as ActivityKey)}
              value={activeTab}
            >
              <div className="py-5">
                {activityQuery.isPending && (
                  <State
                    description="Mohon tunggu sebentar."
                    title={`Memuat data ${activeTab}...`}
                    tone="loading"
                  />
                )}
                {activityQuery.isError && (
                  <State title="Aktivitas BKD belum dapat dimuat" tone="error" />
                )}
                {activityQuery.data && activityQuery.data.items.length === 0 && (
                  <State description="Belum ada aktivitas pada semester ini." title="Belum ada aktivitas" />
                )}
                {activityQuery.data && activityQuery.data.items.length > 0 && (
                  <BkdActivityTable items={activityQuery.data.items} />
                )}
              </div>
            </Tabs>
          </section>
        </>
      )}
    </section>
  );
}

function PanelHeading({ description, title }: { description: string; title: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
          <BarChart3 aria-hidden size={17} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">{title}</h2>
          <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">{description}</p>
        </div>
      </div>
    </div>
  );
}

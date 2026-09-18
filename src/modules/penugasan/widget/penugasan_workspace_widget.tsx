"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";

import { Select } from "@/component/ui/select";
import { State } from "@/component/ui/state";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { PenugasanTable } from "./penugasan_table";

const emptySdmId = "00000000-0000-0000-0000-000000000000";

type PenugasanWorkspaceWidgetProps = {
  sdmId?: string;
};

export function PenugasanWorkspaceWidget({ sdmId }: PenugasanWorkspaceWidgetProps = {}) {
  const trpc = useTRPC();
  const [pickedSdmId, setPickedSdmId] = useState("");
  const effectiveSdmId = sdmId ?? pickedSdmId;

  const pegawaiQuery = useQuery({
    ...trpc.pegawai.search.queryOptions({
      search_by: "nama",
      search: "",
      page: 1,
      per_page: 50,
    }),
    enabled: !sdmId,
  });
  const penugasanQuery = useQuery({
    ...trpc.penugasan.list.queryOptions({ id_sdm: effectiveSdmId || emptySdmId }),
    enabled: Boolean(effectiveSdmId),
  });
  const selectedPegawai = pegawaiQuery.data?.items.find(
    (item) => item.id_sdm === effectiveSdmId,
  );

  return (
    <section className="space-y-4">
      {!sdmId && (
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end">
          {pegawaiQuery.data?.source && <SourceBadge source={pegawaiQuery.data.source} />}
          <Select
            ariaLabel="Pilih pegawai untuk penugasan"
            disabled={pegawaiQuery.isPending || pegawaiQuery.isError}
            onValueChange={setPickedSdmId}
            options={[
              { label: "Pilih pegawai", value: "" },
              ...(pegawaiQuery.data?.items.map((item) => ({
                label: `${item.nama_sdm}${item.nidn ? ` - ${item.nidn}` : ""}`,
                value: item.id_sdm,
              })) ?? []),
            ]}
            value={pickedSdmId}
          />
          {pegawaiQuery.isPending && (
            <p className="text-xs text-[hsl(var(--color-muted))]">Memuat daftar pegawai...</p>
          )}
          {selectedPegawai && (
            <p className="text-xs text-[hsl(var(--color-muted))]">
              Konteks aktif:{" "}
              <span className="font-semibold text-[hsl(var(--color-text))]">
                {selectedPegawai.nama_sdm}
              </span>
            </p>
          )}
        </div>
      )}

      {!sdmId && pegawaiQuery.isError && (
        <State
          description="Periksa session dan koneksi SISTER."
          title="Daftar pegawai belum dapat dimuat"
          tone="error"
        />
      )}
      {!effectiveSdmId && (
        <State
          description="Data penugasan akan dimuat setelah SDM dipilih."
          icon={<ClipboardList aria-hidden size={18} />}
          title="Pilih pegawai terlebih dahulu"
        />
      )}
      {effectiveSdmId && penugasanQuery.isPending && (
        <State description="Mohon tunggu sebentar." title="Memuat penugasan..." tone="loading" />
      )}
      {effectiveSdmId && penugasanQuery.isError && (
        <State title="Daftar penugasan belum dapat dimuat" tone="error" />
      )}
      {effectiveSdmId && penugasanQuery.data?.items.length === 0 && (
        <State description="Belum ada penugasan untuk pegawai ini." title="Belum ada penugasan" />
      )}
      {penugasanQuery.data && penugasanQuery.data.items.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">
                Penugasan dan penempatan
              </h2>
              <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                {penugasanQuery.data.items.length} data ditemukan
              </p>
            </div>
            <SourceBadge source={penugasanQuery.data.source} />
          </div>
          <PenugasanTable items={penugasanQuery.data.items} />
        </section>
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

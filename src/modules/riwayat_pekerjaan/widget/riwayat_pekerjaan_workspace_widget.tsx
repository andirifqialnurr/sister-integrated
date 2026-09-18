"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness } from "lucide-react";

import { Select } from "@/component/ui/select";
import { State } from "@/component/ui/state";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { RiwayatPekerjaanTable } from "./riwayat_pekerjaan_table";

const emptySdmId = "00000000-0000-0000-0000-000000000000";

export function RiwayatPekerjaanWorkspaceWidget() {
  const trpc = useTRPC();
  const [selectedSdmId, setSelectedSdmId] = useState("");

  const pegawaiQuery = useQuery(
    trpc.pegawai.search.queryOptions({
      search_by: "nama",
      search: "",
      page: 1,
      per_page: 50,
    }),
  );
  const riwayatPekerjaanQuery = useQuery({
    ...trpc.riwayat_pekerjaan.list.queryOptions({ id_sdm: selectedSdmId || emptySdmId }),
    enabled: Boolean(selectedSdmId),
  });
  const selectedPegawai = pegawaiQuery.data?.items.find(
    (item) => item.id_sdm === selectedSdmId,
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end">
        {pegawaiQuery.data?.source && <SourceBadge source={pegawaiQuery.data.source} />}
        <Select
          ariaLabel="Pilih pegawai untuk riwayat pekerjaan"
          disabled={pegawaiQuery.isPending || pegawaiQuery.isError}
          onValueChange={setSelectedSdmId}
          options={[
            { label: "Pilih pegawai", value: "" },
            ...(pegawaiQuery.data?.items.map((item) => ({
              label: `${item.nama_sdm}${item.nidn ? ` - ${item.nidn}` : ""}`,
              value: item.id_sdm,
            })) ?? []),
          ]}
          value={selectedSdmId}
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

      {pegawaiQuery.isError && (
        <StateFromCode code={pegawaiQuery.error?.data?.code} label="Daftar pegawai belum dapat dimuat." />
      )}
      {!selectedSdmId && (
        <State
          description="Data riwayat pekerjaan akan dimuat setelah SDM dipilih."
          icon={<BriefcaseBusiness aria-hidden size={18} />}
          title="Pilih pegawai terlebih dahulu"
        />
      )}
      {selectedSdmId && riwayatPekerjaanQuery.isPending && (
        <State description="Mohon tunggu sebentar." title="Memuat riwayat pekerjaan..." tone="loading" />
      )}
      {selectedSdmId && riwayatPekerjaanQuery.isError && (
        <StateFromCode
          code={riwayatPekerjaanQuery.error?.data?.code}
          label="Daftar riwayat pekerjaan belum dapat dimuat."
        />
      )}
      {selectedSdmId && riwayatPekerjaanQuery.data?.items.length === 0 && (
        <State description="Belum ada riwayat pekerjaan untuk pegawai ini." title="Belum ada riwayat pekerjaan" />
      )}
      {riwayatPekerjaanQuery.data && riwayatPekerjaanQuery.data.items.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">
                Riwayat pekerjaan
              </h2>
              <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                {riwayatPekerjaanQuery.data.items.length} data ditemukan
              </p>
            </div>
            <SourceBadge source={riwayatPekerjaanQuery.data.source} />
          </div>
          <RiwayatPekerjaanTable items={riwayatPekerjaanQuery.data.items} />
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

function StateFromCode({ code, label }: { code?: string; label: string }) {
  if (code === "UNAUTHORIZED") {
    return (
      <State description="Session diperlukan untuk membaca data ini." title="Akses ditolak" tone="forbidden" />
    );
  }
  if (code === "FORBIDDEN") {
    return (
      <State
        description="Session tidak memiliki akses ke data ini."
        title="Akses ditolak"
        tone="forbidden"
      />
    );
  }
  if (code === "NOT_FOUND") {
    return (
      <State description="Data riwayat pekerjaan tidak ditemukan." title="Data tidak ditemukan" tone="unavailable" />
    );
  }
  return <State title={label} tone="error" />;
}

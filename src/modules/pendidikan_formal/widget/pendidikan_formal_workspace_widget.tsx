"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";

import { Select } from "@/component/ui/select";
import { State } from "@/component/ui/state";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { PendidikanFormalTable } from "./pendidikan_formal_table";

const emptySdmId = "00000000-0000-0000-0000-000000000000";

export function PendidikanFormalWorkspaceWidget() {
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
  const pendidikanFormalQuery = useQuery({
    ...trpc.pendidikan_formal.list.queryOptions({ id_sdm: selectedSdmId || emptySdmId }),
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
          ariaLabel="Pilih pegawai untuk pendidikan formal"
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
          description="Data pendidikan formal akan dimuat setelah SDM dipilih."
          icon={<GraduationCap aria-hidden size={18} />}
          title="Pilih pegawai terlebih dahulu"
        />
      )}
      {selectedSdmId && pendidikanFormalQuery.isPending && (
        <State description="Mohon tunggu sebentar." title="Memuat pendidikan formal..." tone="loading" />
      )}
      {selectedSdmId && pendidikanFormalQuery.isError && (
        <StateFromCode
          code={pendidikanFormalQuery.error?.data?.code}
          label="Daftar pendidikan formal belum dapat dimuat."
        />
      )}
      {selectedSdmId && pendidikanFormalQuery.data?.items.length === 0 && (
        <State description="Belum ada pendidikan formal untuk pegawai ini." title="Belum ada pendidikan formal" />
      )}
      {pendidikanFormalQuery.data && pendidikanFormalQuery.data.items.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">
                Riwayat pendidikan formal
              </h2>
              <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                {pendidikanFormalQuery.data.items.length} data ditemukan
              </p>
            </div>
            <SourceBadge source={pendidikanFormalQuery.data.source} />
          </div>
          <PendidikanFormalTable items={pendidikanFormalQuery.data.items} />
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
      <State description="Data pendidikan formal tidak ditemukan." title="Data tidak ditemukan" tone="unavailable" />
    );
  }
  return <State title={label} tone="error" />;
}

"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Select } from "@/component/ui/select";
import { State } from "@/component/ui/state";
import { useTRPC } from "@/lib/trpc";

const jenisUnitLabel: Record<number, string> = {
  1: "Fakultas",
  2: "Jurusan",
  3: "Program Studi",
  4: "Laboratorium",
  5: "UPT",
  6: "Penyelenggara MKU",
  7: "Rektorat",
  8: "Unit Kerja",
};

export function UnitKerjaExplorerWidget() {
  const trpc = useTRPC();
  const [perguruanTinggiId, setPerguruanTinggiId] = useState("");
  const [unitKerjaId, setUnitKerjaId] = useState("");

  const perguruanTinggiQuery = useQuery(
    trpc.referensi.get_perguruan_tinggi.queryOptions({}),
  );
  const unitKerjaQuery = useQuery({
    ...trpc.referensi.get_unit_kerja.queryOptions({
      id_perguruan_tinggi: perguruanTinggiId,
    }),
    enabled: Boolean(perguruanTinggiId),
  });

  const unitKerjaTerpilih = unitKerjaQuery.data?.items.find((item) => item.id === unitKerjaId);

  if (perguruanTinggiQuery.isPending) {
    return (
      <State description="Mohon tunggu sebentar." title="Memuat perguruan tinggi..." tone="loading" />
    );
  }

  if (perguruanTinggiQuery.isError) {
    return (
      <State
        description="Periksa session dan koneksi SISTER."
        title="Perguruan tinggi belum dapat dimuat"
        tone="error"
      />
    );
  }

  if (perguruanTinggiQuery.data.items.length === 0) {
    return (
      <State description="Tidak ada data perguruan tinggi pada response SISTER." title="Belum ada data" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          ariaLabel="Pilih perguruan tinggi"
          onValueChange={(value) => {
            setPerguruanTinggiId(value);
            setUnitKerjaId("");
          }}
          options={[
            { label: "Pilih perguruan tinggi", value: "" },
            ...perguruanTinggiQuery.data.items.map((item) => ({
              label: item.nama,
              value: item.id,
            })),
          ]}
          value={perguruanTinggiId}
        />
        <Select
          ariaLabel="Pilih unit kerja"
          disabled={!perguruanTinggiId || unitKerjaQuery.isPending}
          onValueChange={setUnitKerjaId}
          options={[
            { label: "Pilih unit kerja", value: "" },
            ...(unitKerjaQuery.data?.items.map((item) => ({
              label: `${item.nama} (${jenisUnitLabel[item.id_jenis_unit]})`,
              value: item.id,
            })) ?? []),
          ]}
          value={unitKerjaId}
        />
      </div>

      {perguruanTinggiId && unitKerjaQuery.isError && (
        <State title="Unit kerja belum dapat dimuat" tone="error" />
      )}
      {perguruanTinggiId && unitKerjaQuery.data?.items.length === 0 && (
        <State
          description="Tidak ada unit kerja pada perguruan tinggi ini."
          title="Belum ada unit kerja"
        />
      )}
      {unitKerjaTerpilih && (
        <p className="text-xs text-[hsl(var(--color-muted))]">
          Unit kerja terpilih:{" "}
          <span className="font-semibold text-[hsl(var(--color-text))]">
            {unitKerjaTerpilih.nama}
          </span>{" "}
          ({jenisUnitLabel[unitKerjaTerpilih.id_jenis_unit]}, id {unitKerjaTerpilih.id})
        </p>
      )}
    </div>
  );
}

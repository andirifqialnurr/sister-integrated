"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Select } from "@/component/ui/select";
import { State } from "@/component/ui/state";
import { useTRPC } from "@/lib/trpc";

type WilayahLevelState = {
  parentId: string;
  setParentId: (value: string) => void;
};

export function WilayahExplorerWidget() {
  const trpc = useTRPC();
  const [negaraId, setNegaraId] = useState("");
  const [provinsiId, setProvinsiId] = useState("");
  const [kotaId, setKotaId] = useState("");
  const [kecamatanId, setKecamatanId] = useState("");

  const negaraQuery = useQuery(trpc.referensi.get_wilayah.queryOptions({ id_level_wilayah: 0 }));
  const provinsiQuery = useQuery({
    ...trpc.referensi.get_wilayah.queryOptions({ id_level_wilayah: 1 }),
    enabled: Boolean(negaraId),
  });
  const kotaQuery = useQuery({
    ...trpc.referensi.get_wilayah.queryOptions({ id_level_wilayah: 2 }),
    enabled: Boolean(provinsiId),
  });
  const kecamatanQuery = useQuery({
    ...trpc.referensi.get_wilayah.queryOptions({ id_level_wilayah: 3 }),
    enabled: Boolean(kotaId),
  });

  const provinsiOptions = (provinsiQuery.data?.items ?? []).filter(
    (item) => item.id_induk_wilayah === negaraId,
  );
  const kotaOptions = (kotaQuery.data?.items ?? []).filter(
    (item) => item.id_induk_wilayah === provinsiId,
  );
  const kecamatanOptions = (kecamatanQuery.data?.items ?? []).filter(
    (item) => item.id_induk_wilayah === kotaId,
  );
  const kecamatanTerpilih = kecamatanOptions.find((item) => item.id === kecamatanId);

  if (negaraQuery.isPending) {
    return <State description="Mohon tunggu sebentar." title="Memuat wilayah..." tone="loading" />;
  }

  if (negaraQuery.isError) {
    return (
      <State
        description="Periksa session dan koneksi SISTER."
        title="Wilayah belum dapat dimuat"
        tone="error"
      />
    );
  }

  if (negaraQuery.data.items.length === 0) {
    return <State description="Tidak ada data negara pada response SISTER." title="Belum ada wilayah" />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <WilayahLevelSelect
          ariaLabel="Pilih negara"
          level={{
            parentId: negaraId,
            setParentId: (value) => {
              setNegaraId(value);
              setProvinsiId("");
              setKotaId("");
              setKecamatanId("");
            },
          }}
          options={negaraQuery.data.items}
          placeholder="Pilih negara"
        />
        <WilayahLevelSelect
          ariaLabel="Pilih provinsi"
          disabled={!negaraId || provinsiQuery.isPending}
          level={{
            parentId: provinsiId,
            setParentId: (value) => {
              setProvinsiId(value);
              setKotaId("");
              setKecamatanId("");
            },
          }}
          options={provinsiOptions}
          placeholder="Pilih provinsi"
        />
        <WilayahLevelSelect
          ariaLabel="Pilih kota/kabupaten"
          disabled={!provinsiId || kotaQuery.isPending}
          level={{
            parentId: kotaId,
            setParentId: (value) => {
              setKotaId(value);
              setKecamatanId("");
            },
          }}
          options={kotaOptions}
          placeholder="Pilih kota/kabupaten"
        />
        <WilayahLevelSelect
          ariaLabel="Pilih kecamatan"
          disabled={!kotaId || kecamatanQuery.isPending}
          level={{ parentId: kecamatanId, setParentId: setKecamatanId }}
          options={kecamatanOptions}
          placeholder="Pilih kecamatan"
        />
      </div>

      {negaraId && provinsiQuery.isError && (
        <State title="Provinsi belum dapat dimuat" tone="error" />
      )}
      {provinsiId && kotaQuery.isError && (
        <State title="Kota/kabupaten belum dapat dimuat" tone="error" />
      )}
      {kotaId && kecamatanQuery.isError && <State title="Kecamatan belum dapat dimuat" tone="error" />}

      {kecamatanTerpilih && (
        <p className="text-xs text-[hsl(var(--color-muted))]">
          Wilayah terpilih:{" "}
          <span className="font-semibold text-[hsl(var(--color-text))]">
            {kecamatanTerpilih.nama}
          </span>{" "}
          (id {kecamatanTerpilih.id}, induk {kecamatanTerpilih.id_induk_wilayah})
        </p>
      )}
    </div>
  );
}

function WilayahLevelSelect({
  ariaLabel,
  disabled,
  level,
  options,
  placeholder,
}: {
  ariaLabel: string;
  disabled?: boolean;
  level: WilayahLevelState;
  options: { id: string; nama: string }[];
  placeholder: string;
}) {
  return (
    <Select
      ariaLabel={ariaLabel}
      disabled={disabled}
      onValueChange={level.setParentId}
      options={[
        { label: placeholder, value: "" },
        ...options.map((item) => ({ label: item.nama, value: item.id })),
      ]}
      value={level.parentId}
    />
  );
}

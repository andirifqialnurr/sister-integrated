"use client";

import { useQuery } from "@tanstack/react-query";

import { Select } from "@/component/ui/select";
import { useTRPC } from "@/lib/trpc";

type PendidikanFormalSdmPickerProps = {
  value: string;
  onChange: (sdmId: string) => void;
};

export function PendidikanFormalSdmPicker({ onChange, value }: PendidikanFormalSdmPickerProps) {
  const trpc = useTRPC();
  const pegawaiQuery = useQuery(
    trpc.pegawai.search.queryOptions({
      search_by: "nama",
      search: "",
      page: 1,
      per_page: 50,
    }),
  );

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      <Select
        ariaLabel="Pilih pegawai untuk pendidikan formal"
        disabled={pegawaiQuery.isPending || pegawaiQuery.isError}
        onValueChange={onChange}
        options={[
          { label: "Pilih pegawai", value: "" },
          ...(pegawaiQuery.data?.items.map((item) => ({
            label: `${item.nama_sdm}${item.nidn ? ` - ${item.nidn}` : ""}`,
            value: item.id_sdm,
          })) ?? []),
        ]}
        value={value}
      />
      {pegawaiQuery.isError && (
        <p className="text-xs text-[hsl(var(--color-danger-strong))]">
          Daftar pegawai belum dapat dimuat.
        </p>
      )}
    </div>
  );
}

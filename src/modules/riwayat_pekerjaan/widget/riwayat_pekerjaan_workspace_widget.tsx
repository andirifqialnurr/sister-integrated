"use client";

import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness } from "lucide-react";

import { State } from "@/component/ui/state";
import { useTRPC } from "@/lib/trpc";

import { RiwayatPekerjaanTable } from "./riwayat_pekerjaan_table";

const emptySdmId = "00000000-0000-0000-0000-000000000000";

type RiwayatPekerjaanWorkspaceWidgetProps = {
  sdmId: string;
};

export function RiwayatPekerjaanWorkspaceWidget({ sdmId }: RiwayatPekerjaanWorkspaceWidgetProps) {
  const trpc = useTRPC();
  const riwayatPekerjaanQuery = useQuery({
    ...trpc.riwayat_pekerjaan.list.queryOptions({ id_sdm: sdmId || emptySdmId }),
    enabled: Boolean(sdmId),
  });

  return (
    <section className="space-y-4">
      {!sdmId && (
        <State
          description="Data riwayat pekerjaan akan dimuat setelah SDM dipilih."
          icon={<BriefcaseBusiness aria-hidden size={18} />}
          title="Pilih pegawai terlebih dahulu"
        />
      )}
      {sdmId && riwayatPekerjaanQuery.isPending && (
        <State description="Mohon tunggu sebentar." title="Memuat riwayat pekerjaan..." tone="loading" />
      )}
      {sdmId && riwayatPekerjaanQuery.isError && (
        <StateFromCode
          code={riwayatPekerjaanQuery.error?.data?.code}
          label="Daftar riwayat pekerjaan belum dapat dimuat."
        />
      )}
      {sdmId && riwayatPekerjaanQuery.data?.items.length === 0 && (
        <State description="Belum ada riwayat pekerjaan untuk pegawai ini." title="Belum ada riwayat pekerjaan" />
      )}
      {riwayatPekerjaanQuery.data && riwayatPekerjaanQuery.data.items.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">Riwayat pekerjaan</h2>
            <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
              {riwayatPekerjaanQuery.data.items.length} data ditemukan
            </p>
          </div>
          <RiwayatPekerjaanTable items={riwayatPekerjaanQuery.data.items} />
        </section>
      )}
    </section>
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

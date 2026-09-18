"use client";

import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";

import { State } from "@/component/ui/state";
import { useTRPC } from "@/lib/trpc";

import { PendidikanFormalTable } from "./pendidikan_formal_table";

const emptySdmId = "00000000-0000-0000-0000-000000000000";

type PendidikanFormalWorkspaceWidgetProps = {
  sdmId: string;
};

export function PendidikanFormalWorkspaceWidget({ sdmId }: PendidikanFormalWorkspaceWidgetProps) {
  const trpc = useTRPC();
  const pendidikanFormalQuery = useQuery({
    ...trpc.pendidikan_formal.list.queryOptions({ id_sdm: sdmId || emptySdmId }),
    enabled: Boolean(sdmId),
  });

  return (
    <section className="space-y-4">
      {!sdmId && (
        <State
          description="Data pendidikan formal akan dimuat setelah SDM dipilih."
          icon={<GraduationCap aria-hidden size={18} />}
          title="Pilih pegawai terlebih dahulu"
        />
      )}
      {sdmId && pendidikanFormalQuery.isPending && (
        <State description="Mohon tunggu sebentar." title="Memuat pendidikan formal..." tone="loading" />
      )}
      {sdmId && pendidikanFormalQuery.isError && (
        <StateFromCode
          code={pendidikanFormalQuery.error?.data?.code}
          label="Daftar pendidikan formal belum dapat dimuat."
        />
      )}
      {sdmId && pendidikanFormalQuery.data?.items.length === 0 && (
        <State description="Belum ada pendidikan formal untuk pegawai ini." title="Belum ada pendidikan formal" />
      )}
      {pendidikanFormalQuery.data && pendidikanFormalQuery.data.items.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">
              Riwayat pendidikan formal
            </h2>
            <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
              {pendidikanFormalQuery.data.items.length} data ditemukan
            </p>
          </div>
          <PendidikanFormalTable items={pendidikanFormalQuery.data.items} />
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
      <State description="Data pendidikan formal tidak ditemukan." title="Data tidak ditemukan" tone="unavailable" />
    );
  }
  return <State title={label} tone="error" />;
}

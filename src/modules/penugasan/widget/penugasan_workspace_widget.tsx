"use client";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";

import { State } from "@/component/ui/state";
import { useTRPC } from "@/lib/trpc";

import { PenugasanTable } from "./penugasan_table";

const emptySdmId = "00000000-0000-0000-0000-000000000000";

type PenugasanWorkspaceWidgetProps = {
  sdmId: string;
};

export function PenugasanWorkspaceWidget({ sdmId }: PenugasanWorkspaceWidgetProps) {
  const trpc = useTRPC();
  const penugasanQuery = useQuery({
    ...trpc.penugasan.list.queryOptions({ id_sdm: sdmId || emptySdmId }),
    enabled: Boolean(sdmId),
  });

  return (
    <section className="space-y-4">
      {!sdmId && (
        <State
          description="Data penugasan akan dimuat setelah SDM dipilih."
          icon={<ClipboardList aria-hidden size={18} />}
          title="Pilih pegawai terlebih dahulu"
        />
      )}
      {sdmId && penugasanQuery.isPending && (
        <State description="Mohon tunggu sebentar." title="Memuat penugasan..." tone="loading" />
      )}
      {sdmId && penugasanQuery.isError && (
        <State title="Daftar penugasan belum dapat dimuat" tone="error" />
      )}
      {sdmId && penugasanQuery.data?.items.length === 0 && (
        <State description="Belum ada penugasan untuk pegawai ini." title="Belum ada penugasan" />
      )}
      {penugasanQuery.data && penugasanQuery.data.items.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">
              Penugasan dan penempatan
            </h2>
            <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
              {penugasanQuery.data.items.length} data ditemukan
            </p>
          </div>
          <PenugasanTable items={penugasanQuery.data.items} />
        </section>
      )}
    </section>
  );
}

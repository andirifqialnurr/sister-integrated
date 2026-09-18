"use client";

import { useQuery } from "@tanstack/react-query";

import { PageShell } from "@/component/ui/page_shell";
import { State } from "@/component/ui/state";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { RiwayatPekerjaanDetailWidget } from "../widget/riwayat_pekerjaan_detail_widget";

type RiwayatPekerjaanDetailPageProps = {
  idRiwayatPekerjaan: string;
};

export function RiwayatPekerjaanDetailPage({
  idRiwayatPekerjaan,
}: RiwayatPekerjaanDetailPageProps) {
  const trpc = useTRPC();
  const detailQuery = useQuery(
    trpc.riwayat_pekerjaan.get_detail.queryOptions({
      id_riwayat_pekerjaan: idRiwayatPekerjaan,
    }),
  );

  return (
    <PageShell
      actions={<StatusBadge tone="neutral">Read-only</StatusBadge>}
      activeLabel="Riwayat Pekerjaan"
      breadcrumb={[
        { href: "/", label: "Ikhtisar" },
        { href: "/riwayat_pekerjaan", label: "Riwayat Pekerjaan" },
      ]}
      detailLabel={detailQuery.data?.item.nama_jabatan ?? "riwayat pekerjaan"}
      maxWidth="1100px"
    >
          {detailQuery.isPending && (
            <State
              description="Mohon tunggu sebentar."
              title="Memuat detail riwayat pekerjaan..."
              tone="loading"
            />
          )}

          {detailQuery.isError && (
            <State
              description="Pastikan ID berasal dari hasil list dan session memiliki akses read-only."
              title="Detail riwayat pekerjaan tidak dapat dimuat"
              tone="error"
            />
          )}

          {detailQuery.data && (
            <RiwayatPekerjaanDetailWidget item={detailQuery.data.item} />
          )}
    </PageShell>
  );
}

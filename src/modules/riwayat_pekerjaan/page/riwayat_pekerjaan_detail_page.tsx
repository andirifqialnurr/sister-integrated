"use client";

import { useQuery } from "@tanstack/react-query";

import { PageShell } from "@/component/ui/page_shell";
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
      actions={
        <>
          {detailQuery.data?.source && (
            <StatusBadge tone={detailQuery.data.source === "sister" ? "success" : "warning"}>
              {detailQuery.data.source === "sister" ? "SISTER" : "Fixture mode"}
            </StatusBadge>
          )}
          <StatusBadge tone="neutral">Read-only</StatusBadge>
        </>
      }
      activeLabel="Riwayat Pekerjaan"
      breadcrumb={[
        { href: "/", label: "Ikhtisar" },
        { href: "/riwayat_pekerjaan", label: "Riwayat Pekerjaan" },
      ]}
      detailLabel={detailQuery.data?.item.nama_jabatan ?? "riwayat pekerjaan"}
      maxWidth="1100px"
    >
          {detailQuery.isPending && (
            <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">
              Memuat detail riwayat pekerjaan...
            </div>
          )}

          {detailQuery.isError && (
            <div className="rounded-xl border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-5 text-sm text-[hsl(var(--color-danger-strong))]">
              Detail riwayat pekerjaan tidak dapat dimuat. Pastikan ID berasal dari hasil
              list dan session memiliki akses read-only.
            </div>
          )}

          {detailQuery.data && (
            <RiwayatPekerjaanDetailWidget item={detailQuery.data.item} />
          )}
    </PageShell>
  );
}

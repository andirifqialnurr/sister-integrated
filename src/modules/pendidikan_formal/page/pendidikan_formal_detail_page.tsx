"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { PageShell } from "@/component/ui/page_shell";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { PendidikanFormalDetailWidget } from "../widget/pendidikan_formal_detail_widget";

const emptyPendidikanFormalId = "00000000-0000-0000-0000-000000000000";

export function PendidikanFormalDetailPage() {
  const trpc = useTRPC();
  const params = useParams<{ id_pendidikan_formal?: string }>();
  const idPendidikanFormal =
    typeof params.id_pendidikan_formal === "string" ? params.id_pendidikan_formal : "";
  const detailQuery = useQuery({
    ...trpc.pendidikan_formal.get_detail.queryOptions({
      id_pendidikan_formal: idPendidikanFormal || emptyPendidikanFormalId,
    }),
    enabled: Boolean(idPendidikanFormal),
  });
  const errorCode = detailQuery.error?.data?.code;

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
      activeLabel="Pendidikan Formal"
      breadcrumb={[
        { href: "/", label: "Ikhtisar" },
        { href: "/pendidikan_formal", label: "Pendidikan Formal" },
      ]}
      detailLabel={detailQuery.data?.item.jenjang_pendidikan ?? "pendidikan formal"}
    >
          {detailQuery.isPending && (
            <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">
              Memuat detail pendidikan formal...
            </div>
          )}
          {detailQuery.isError && (
            <div className="rounded-xl border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-5 text-sm text-[hsl(var(--color-danger-strong))]">
              {errorCode === "UNAUTHORIZED"
                ? "Session diperlukan untuk membaca detail pendidikan formal."
                : errorCode === "FORBIDDEN"
                  ? "Session tidak memiliki akses ke detail pendidikan formal ini."
                  : errorCode === "NOT_FOUND"
                    ? "Pendidikan formal tidak ditemukan atau sudah tidak tersedia."
                    : "Detail pendidikan formal belum dapat dimuat. Periksa session dan koneksi SISTER."}
            </div>
          )}
          {detailQuery.data && <PendidikanFormalDetailWidget item={detailQuery.data.item} />}
    </PageShell>
  );
}

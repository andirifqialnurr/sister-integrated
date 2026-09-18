"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { PageShell } from "@/component/ui/page_shell";
import { State } from "@/component/ui/state";
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
      actions={<StatusBadge tone="neutral">Read-only</StatusBadge>}
      activeLabel="Pendidikan Formal"
      breadcrumb={[
        { href: "/", label: "Ikhtisar" },
        { href: "/pendidikan_formal", label: "Pendidikan Formal" },
      ]}
      detailLabel={detailQuery.data?.item.jenjang_pendidikan ?? "pendidikan formal"}
    >
          {detailQuery.isPending && (
            <State
              description="Mohon tunggu sebentar."
              title="Memuat detail pendidikan formal..."
              tone="loading"
            />
          )}
          {detailQuery.isError && (
            <State
              title={
                errorCode === "UNAUTHORIZED" || errorCode === "FORBIDDEN"
                  ? "Akses ditolak"
                  : errorCode === "NOT_FOUND"
                    ? "Pendidikan formal tidak ditemukan"
                    : "Detail pendidikan formal belum dapat dimuat"
              }
              description={
                errorCode === "UNAUTHORIZED"
                  ? "Session diperlukan untuk membaca detail pendidikan formal."
                  : errorCode === "FORBIDDEN"
                    ? "Session tidak memiliki akses ke detail pendidikan formal ini."
                    : errorCode === "NOT_FOUND"
                      ? "Pendidikan formal tidak ditemukan atau sudah tidak tersedia."
                      : "Periksa session dan koneksi SISTER."
              }
              tone={
                errorCode === "UNAUTHORIZED" || errorCode === "FORBIDDEN"
                  ? "forbidden"
                  : errorCode === "NOT_FOUND"
                    ? "unavailable"
                    : "error"
              }
            />
          )}
          {detailQuery.data && <PendidikanFormalDetailWidget item={detailQuery.data.item} />}
    </PageShell>
  );
}

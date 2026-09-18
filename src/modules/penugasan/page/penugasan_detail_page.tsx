"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { PageShell } from "@/component/ui/page_shell";
import { State } from "@/component/ui/state";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { PenugasanDetailWidget } from "../widget/penugasan_detail_widget";

const emptyPenugasanId = "00000000-0000-0000-0000-000000000000";

export function PenugasanDetailPage() {
  const trpc = useTRPC();
  const params = useParams<{ id_penugasan?: string }>();
  const idPenugasan = typeof params.id_penugasan === "string" ? params.id_penugasan : "";
  const detailQuery = useQuery({
    ...trpc.penugasan.get_detail.queryOptions({
      id_penugasan: idPenugasan || emptyPenugasanId,
    }),
    enabled: Boolean(idPenugasan),
  });
  const errorCode = detailQuery.error?.data?.code;

  return (
    <PageShell
      actions={<StatusBadge tone="neutral">Read-only</StatusBadge>}
      activeLabel="Penugasan"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { href: "/penugasan", label: "Penugasan" }]}
      detailLabel={detailQuery.data?.item.unit_kerja ?? "penugasan"}
    >
          {detailQuery.isPending && (
            <State description="Mohon tunggu sebentar." title="Memuat detail penugasan..." tone="loading" />
          )}
          {detailQuery.isError && (
            <State
              title={
                errorCode === "NOT_FOUND"
                  ? "Penugasan tidak ditemukan"
                  : "Detail penugasan belum dapat dimuat"
              }
              description={
                errorCode === "NOT_FOUND"
                  ? "Penugasan tidak ditemukan atau sudah tidak tersedia."
                  : "Periksa session dan koneksi SISTER."
              }
              tone={errorCode === "NOT_FOUND" ? "unavailable" : "error"}
            />
          )}
          {detailQuery.data && (
            <PenugasanDetailWidget item={detailQuery.data.item} />
          )}
    </PageShell>
  );
}

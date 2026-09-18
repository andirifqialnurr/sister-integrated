"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { PageShell } from "@/component/ui/page_shell";
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
            <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">
              Memuat detail penugasan...
            </div>
          )}
          {detailQuery.isError && (
            <div className="rounded-xl border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-5 text-sm text-[hsl(var(--color-danger-strong))]">
              {errorCode === "NOT_FOUND"
                ? "Penugasan tidak ditemukan atau sudah tidak tersedia."
                : "Detail penugasan belum dapat dimuat. Periksa session dan koneksi SISTER."}
            </div>
          )}
          {detailQuery.data && (
            <PenugasanDetailWidget item={detailQuery.data.item} />
          )}
    </PageShell>
  );
}

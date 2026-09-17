"use client";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Sidebar } from "@/component/ui/sidebar";
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
    <div className="flex min-h-screen">
      <Sidebar activeLabel="Riwayat Pekerjaan" />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--color-border))] bg-white px-5 sm:px-8">
          <Link
            className="inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--color-muted))] transition-colors hover:text-[hsl(var(--color-primary))]"
            href="/riwayat_pekerjaan"
          >
            <ArrowLeft aria-hidden size={15} />
            Kembali ke riwayat pekerjaan
          </Link>
          <StatusBadge tone="neutral">Read-only</StatusBadge>
        </header>

        <main className="mx-auto max-w-[1100px] space-y-6 p-5 sm:p-8">
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
            <>
              <div className="flex justify-end">
                <StatusBadge tone={detailQuery.data.source === "sister" ? "success" : "warning"}>
                  {detailQuery.data.source === "sister" ? "SISTER" : "Fixture mode"}
                </StatusBadge>
              </div>
              <RiwayatPekerjaanDetailWidget item={detailQuery.data.item} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

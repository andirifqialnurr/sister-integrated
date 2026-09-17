"use client";

import Link from "next/link";

import { ArrowLeft, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Sidebar } from "@/component/ui/sidebar";
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
    <div className="flex min-h-screen">
      <Sidebar activeLabel="Pendidikan Formal" />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--color-border))] bg-white px-5 sm:px-8">
          <Link
            className="inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--color-muted))] transition-colors hover:text-[hsl(var(--color-primary))]"
            href="/pendidikan_formal"
          >
            <ArrowLeft aria-hidden size={15} />
            Kembali ke pendidikan formal
          </Link>
          <div className="flex items-center gap-2">
            {detailQuery.data?.source && (
              <StatusBadge tone={detailQuery.data.source === "sister" ? "success" : "warning"}>
                {detailQuery.data.source === "sister" ? "SISTER" : "Fixture mode"}
              </StatusBadge>
            )}
            <StatusBadge tone="neutral">Read-only</StatusBadge>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] space-y-6 p-5 sm:p-8">
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
                <GraduationCap aria-hidden size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--color-primary))]">
                  GET /pendidikan_formal/{idPendidikanFormal || "{id}"}
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--color-text))]">
                  Detail Pendidikan Formal
                </h1>
              </div>
            </div>
          </section>

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
        </main>
      </div>
    </div>
  );
}

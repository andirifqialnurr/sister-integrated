"use client";

import Link from "next/link";

import { ArrowLeft, ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Sidebar } from "@/component/ui/sidebar";
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
    <div className="flex min-h-screen">
      <Sidebar activeLabel="Penugasan" />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--color-border))] bg-white px-5 sm:px-8">
          <Link
            className="inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--color-muted))] transition-colors hover:text-[hsl(var(--color-primary))]"
            href="/penugasan"
          >
            <ArrowLeft aria-hidden size={15} />
            Kembali ke penugasan
          </Link>
          <StatusBadge tone="neutral">Read-only</StatusBadge>
        </header>

        <main className="mx-auto max-w-[1440px] space-y-6 p-5 sm:p-8">
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
                <ClipboardList aria-hidden size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--color-primary))]">
                  GET /penugasan/{idPenugasan || "{id}"}
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--color-text))]">
                  Detail Penugasan
                </h1>
              </div>
            </div>
          </section>

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
        </main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Sidebar } from "@/component/ui/sidebar";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { SecurityAuditTable } from "../widget/security_audit_table";

export function SecurityAuditPage() {
  const trpc = useTRPC();
  const auditQuery = useQuery(
    trpc.security.audit_list.queryOptions({ page: 1, per_page: 20 }),
  );

  const errorCode = auditQuery.error?.data?.code;

  return (
    <div className="flex min-h-screen">
      <Sidebar activeLabel="Audit security" />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--color-border))] bg-white px-5 sm:px-8">
          <Link
            className="inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--color-muted))] transition-colors hover:text-[hsl(var(--color-primary))]"
            href="/"
          >
            <ArrowLeft aria-hidden size={15} />
            Kembali ke ikhtisar
          </Link>
          <StatusBadge tone="neutral">ADMIN only</StatusBadge>
        </header>

        <main className="mx-auto max-w-[1440px] space-y-6 p-5 sm:p-8">
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
                <ShieldCheck aria-hidden size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--color-primary))]">
                  Security observability
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--color-text))]">
                  Audit security
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[hsl(var(--color-muted))]">
              Event policy, authorization, dan anomali yang sudah direduksi.
              Password, token, cookie, dan payload mentah tidak ditampilkan.
            </p>
          </section>

          {auditQuery.isPending && (
            <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">
              Memuat audit security...
            </div>
          )}

          {auditQuery.isError && (
            <div className="rounded-xl border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-5 text-sm text-[hsl(var(--color-danger-strong))]">
              {errorCode === "FORBIDDEN"
                ? "Akses ditolak. Audit security hanya dapat dibaca oleh ADMIN."
                : "Audit security belum dapat dimuat. Periksa konfigurasi database dan migration."}
            </div>
          )}

          {auditQuery.data?.source === "unavailable" && (
            <div className="rounded-xl border border-[hsl(var(--color-warning))]/30 bg-[hsl(var(--color-warning-soft))] p-5 text-sm text-[hsl(var(--color-warning-strong))]">
              Database belum dikonfigurasi. Tidak ada event yang dianggap sebagai
              empty result sebelum PostgreSQL tersedia.
            </div>
          )}

          {auditQuery.data?.source === "database" && auditQuery.data.items.length === 0 && (
            <div className="rounded-xl border border-dashed border-[hsl(var(--color-border))] bg-white p-10 text-center">
              <p className="text-sm font-semibold text-[hsl(var(--color-text))]">
                Belum ada event audit
              </p>
              <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                Event baru akan tampil setelah audit database aktif.
              </p>
            </div>
          )}

          {auditQuery.data?.source === "database" && auditQuery.data.items.length > 0 && (
            <section className="overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
              <div className="border-b border-[hsl(var(--color-border))] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">
                      Event terbaru
                    </h2>
                    <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                      {auditQuery.data.total} event ditemukan
                    </p>
                  </div>
                  <StatusBadge tone="success">Redacted</StatusBadge>
                </div>
              </div>
              <SecurityAuditTable items={auditQuery.data.items} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}


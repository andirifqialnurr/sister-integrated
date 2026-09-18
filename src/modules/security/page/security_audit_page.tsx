"use client";

import { useQuery } from "@tanstack/react-query";

import { PageShell } from "@/component/ui/page_shell";
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
    <PageShell
      actions={<StatusBadge tone="neutral">ADMIN only</StatusBadge>}
      activeLabel="Audit security"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Audit security" }]}
    >
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
    </PageShell>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";

import { PageShell } from "@/component/ui/page_shell";
import { State } from "@/component/ui/state";
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
        <State description="Mohon tunggu sebentar." title="Memuat audit security..." tone="loading" />
      )}

      {auditQuery.isError && (
        <State
          description={
            errorCode === "FORBIDDEN"
              ? "Audit security hanya dapat dibaca oleh ADMIN."
              : "Periksa konfigurasi database dan migration."
          }
          title={
            errorCode === "FORBIDDEN"
              ? "Akses ditolak"
              : "Audit security belum dapat dimuat"
          }
          tone={errorCode === "FORBIDDEN" ? "forbidden" : "error"}
        />
      )}

      {auditQuery.data?.source === "unavailable" && (
        <State
          description="Tidak ada event yang dianggap sebagai empty result sebelum PostgreSQL tersedia."
          title="Database belum dikonfigurasi"
          tone="unavailable"
        />
      )}

      {auditQuery.data?.source === "database" && auditQuery.data.items.length === 0 && (
        <State
          description="Event baru akan tampil setelah audit database aktif."
          title="Belum ada event audit"
        />
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

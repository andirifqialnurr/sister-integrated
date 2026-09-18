import { StatusBadge } from "@/component/ui/status_badge";
import { DataTable, type DataTableColumn } from "@/component/widget";

import type { SecurityAuditListResponse } from "../schema/security_audit_schema";

type SecurityAuditItem = SecurityAuditListResponse["items"][number];

type SecurityAuditTableProps = {
  items: SecurityAuditListResponse["items"];
};

function severityTone(severity: string) {
  if (severity === "HIGH" || severity === "CRITICAL") return "danger" as const;
  if (severity === "MEDIUM") return "warning" as const;
  if (severity === "INFO") return "success" as const;
  return "neutral" as const;
}

function outcomeTone(outcome: string) {
  if (outcome === "SUCCESS") return "success" as const;
  if (outcome === "DENIED" || outcome === "BLOCKED") return "danger" as const;
  return "warning" as const;
}

export function SecurityAuditTable({ items }: SecurityAuditTableProps) {
  const columns: DataTableColumn<SecurityAuditItem>[] = [
    {
      key: "waktu",
      header: "Waktu",
      render: (item) => new Date(item.created_at).toLocaleString("id-ID"),
      className: "whitespace-nowrap text-xs text-[hsl(var(--color-muted))]",
    },
    {
      key: "event",
      header: "Event",
      render: (item) => (
        <>
          <p className="font-semibold text-[hsl(var(--color-text))]">{item.event_type}</p>
          <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
            {item.target_type ?? "system"}
            {item.target_id ? ` / ${item.target_id}` : ""}
          </p>
        </>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      render: (item) => <StatusBadge tone={severityTone(item.severity)}>{item.severity}</StatusBadge>,
    },
    {
      key: "outcome",
      header: "Outcome",
      render: (item) => <StatusBadge tone={outcomeTone(item.outcome)}>{item.outcome}</StatusBadge>,
    },
    {
      key: "procedure",
      header: "Procedure",
      render: (item) => item.route_or_procedure,
      className: "font-mono text-xs text-[hsl(var(--color-muted))]",
    },
    {
      key: "request_id",
      header: "Request ID",
      render: (item) => item.request_id,
      className: "font-mono text-xs text-[hsl(var(--color-muted))]",
    },
  ];

  return (
    <DataTable
      caption="Daftar event audit security"
      columns={columns}
      getRowKey={(item) => item.id}
      rows={items}
      tableClassName="min-w-[760px]"
    />
  );
}

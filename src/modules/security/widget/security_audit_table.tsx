import { StatusBadge } from "@/component/ui/status_badge";

import type { SecurityAuditListResponse } from "../schema/security_audit_schema";

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
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <caption className="sr-only">Daftar event audit security</caption>
        <thead className="border-b border-[hsl(var(--color-border))] text-xs text-[hsl(var(--color-muted))]">
          <tr>
            <th className="px-4 py-3 font-semibold" scope="col">Waktu</th>
            <th className="px-4 py-3 font-semibold" scope="col">Event</th>
            <th className="px-4 py-3 font-semibold" scope="col">Severity</th>
            <th className="px-4 py-3 font-semibold" scope="col">Outcome</th>
            <th className="px-4 py-3 font-semibold" scope="col">Procedure</th>
            <th className="px-4 py-3 font-semibold" scope="col">Request ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[hsl(var(--color-border))]">
          {items.map((item) => (
            <tr key={item.id} className="align-top">
              <td className="whitespace-nowrap px-4 py-4 text-xs text-[hsl(var(--color-muted))]">
                {new Date(item.created_at).toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-4">
                <p className="font-semibold text-[hsl(var(--color-text))]">{item.event_type}</p>
                <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                  {item.target_type ?? "system"}
                  {item.target_id ? ` / ${item.target_id}` : ""}
                </p>
              </td>
              <td className="px-4 py-4">
                <StatusBadge tone={severityTone(item.severity)}>{item.severity}</StatusBadge>
              </td>
              <td className="px-4 py-4">
                <StatusBadge tone={outcomeTone(item.outcome)}>{item.outcome}</StatusBadge>
              </td>
              <td className="px-4 py-4 font-mono text-xs text-[hsl(var(--color-muted))]">
                {item.route_or_procedure}
              </td>
              <td className="px-4 py-4 font-mono text-xs text-[hsl(var(--color-muted))]">
                {item.request_id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


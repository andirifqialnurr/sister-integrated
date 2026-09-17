import { redactSecurityMetadata } from "@/server/security/audit";

import {
  PrismaSecurityAuditRepository,
  type SecurityAuditRepository,
  type SecurityAuditRow,
} from "../repository/security_audit_repository";
import {
  securityAuditListResponseSchema,
  type SecurityAuditListInput,
  type SecurityAuditListResponse,
} from "../schema/security_audit_schema";

function toSafeAuditItem(row: SecurityAuditRow) {
  return {
    id: row.id,
    event_type: row.eventType,
    severity: row.severity,
    outcome: row.outcome,
    actor_user_id: row.actorUserId,
    request_id: row.requestId,
    route_or_procedure: row.routeOrProcedure,
    target_type: row.targetType,
    target_id: row.targetId,
    metadata_redacted_json: redactSecurityMetadata(row.metadataRedactedJson) ?? null,
    created_at: row.createdAt.toISOString(),
    reviewed_at: row.reviewedAt?.toISOString() ?? null,
  };
}

export async function listSecurityAudit(
  input: SecurityAuditListInput,
  repository: SecurityAuditRepository = new PrismaSecurityAuditRepository(),
): Promise<SecurityAuditListResponse> {
  if (!process.env.DATABASE_URL?.trim()) {
    return {
      items: [],
      total: 0,
      page: input.page,
      per_page: input.per_page,
      source: "unavailable",
    };
  }

  const result = await repository.list(input);

  return securityAuditListResponseSchema.parse({
    items: result.rows.map(toSafeAuditItem),
    total: result.total,
    page: input.page,
    per_page: input.per_page,
    source: "database",
  });
}


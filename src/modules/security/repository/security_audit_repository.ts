import type { Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

import type { SecurityAuditListInput } from "../schema/security_audit_schema";

export const securityAuditSelect = {
  id: true,
  eventType: true,
  severity: true,
  outcome: true,
  actorUserId: true,
  requestId: true,
  routeOrProcedure: true,
  targetType: true,
  targetId: true,
  metadataRedactedJson: true,
  createdAt: true,
  reviewedAt: true,
} as const satisfies Prisma.SecurityAuditEventSelect;

export type SecurityAuditRow = Prisma.SecurityAuditEventGetPayload<{
  select: typeof securityAuditSelect;
}>;

type SecurityAuditDelegate = Pick<
  PrismaClient["securityAuditEvent"],
  "findMany" | "count"
>;

export type SecurityAuditRepositoryClient = {
  securityAuditEvent: SecurityAuditDelegate;
};

export type SecurityAuditRepository = {
  list(input: SecurityAuditListInput): Promise<{
    rows: SecurityAuditRow[];
    total: number;
  }>;
};

function toWhereInput(input: SecurityAuditListInput): Prisma.SecurityAuditEventWhereInput {
  return {
    eventType: input.event_type,
    severity: input.severity,
    outcome: input.outcome,
  };
}

export class PrismaSecurityAuditRepository implements SecurityAuditRepository {
  constructor(private readonly client: SecurityAuditRepositoryClient = prisma) {}

  async list(input: SecurityAuditListInput) {
    const where = toWhereInput(input);
    const skip = (input.page - 1) * input.per_page;

    const [rows, total] = await Promise.all([
      this.client.securityAuditEvent.findMany({
        where,
        select: securityAuditSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: input.per_page,
      }),
      this.client.securityAuditEvent.count({ where }),
    ]);

    return { rows, total };
  }
}


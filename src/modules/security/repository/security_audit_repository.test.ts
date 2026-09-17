import { describe, expect, it, vi } from "vitest";

import {
  PrismaSecurityAuditRepository,
  type SecurityAuditRepositoryClient,
} from "./security_audit_repository";

const eventId = "d6d66a34-b1f7-490b-bf7b-b1c5a7a0b0f0";

function makeClient() {
  const findMany = vi.fn().mockResolvedValue([
    {
      id: eventId,
      eventType: "authorization_denied",
      severity: "HIGH",
      outcome: "DENIED",
      actorUserId: null,
      requestId: "request-123",
      routeOrProcedure: "security.audit_list",
      targetType: null,
      targetId: null,
      metadataRedactedJson: { reason: "role_not_allowed" },
      createdAt: new Date("2026-09-17T00:00:00.000Z"),
      reviewedAt: null,
    },
  ]);
  const count = vi.fn().mockResolvedValue(1);

  return {
    client: {
      securityAuditEvent: { findMany, count },
    } as unknown as SecurityAuditRepositoryClient,
    findMany,
    count,
  };
}

describe("PrismaSecurityAuditRepository", () => {
  it("selects only safe audit fields with bounded pagination", async () => {
    const { client, findMany, count } = makeClient();
    const repository = new PrismaSecurityAuditRepository(client);

    const result = await repository.list({
      event_type: "authorization_denied",
      severity: "HIGH",
      outcome: "DENIED",
      page: 2,
      per_page: 10,
    });

    expect(result.total).toBe(1);
    expect(result.rows[0]?.id).toBe(eventId);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          eventType: "authorization_denied",
          severity: "HIGH",
          outcome: "DENIED",
        },
        skip: 10,
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
    );
    expect(count).toHaveBeenCalledWith({
      where: {
        eventType: "authorization_denied",
        severity: "HIGH",
        outcome: "DENIED",
      },
    });
  });
});


import { afterEach, describe, expect, it, vi } from "vitest";

import { listSecurityAudit } from "./security_audit_service";

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

const event = {
  id: "d6d66a34-b1f7-490b-bf7b-b1c5a7a0b0f0",
  eventType: "authorization_denied",
  severity: "HIGH" as const,
  outcome: "DENIED" as const,
  actorUserId: null,
  requestId: "request-123",
  routeOrProcedure: "security.audit_list",
  targetType: null,
  targetId: null,
  metadataRedactedJson: {
    reason: "role_not_allowed",
    password: "[REDACTED]",
  },
  createdAt: new Date("2026-09-17T00:00:00.000Z"),
  reviewedAt: null,
};

describe("security audit service", () => {
  it("reports unavailable instead of pretending the database is empty", async () => {
    delete process.env.DATABASE_URL;
    const repository = { list: vi.fn() };

    await expect(
      listSecurityAudit(
        { page: 1, per_page: 20 },
        repository,
      ),
    ).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      per_page: 20,
      source: "unavailable",
    });
    expect(repository.list).not.toHaveBeenCalled();
  });

  it("returns a redacted DTO when the database repository has data", async () => {
    process.env.DATABASE_URL = "postgresql://test/test";
    const repository = { list: vi.fn().mockResolvedValue({ rows: [event], total: 1 }) };

    await expect(
      listSecurityAudit({ page: 1, per_page: 20 }, repository),
    ).resolves.toEqual({
      items: [
        {
          id: event.id,
          event_type: event.eventType,
          severity: event.severity,
          outcome: event.outcome,
          actor_user_id: null,
          request_id: event.requestId,
          route_or_procedure: event.routeOrProcedure,
          target_type: null,
          target_id: null,
          metadata_redacted_json: {
            reason: "role_not_allowed",
            password: "[REDACTED]",
          },
          created_at: "2026-09-17T00:00:00.000Z",
          reviewed_at: null,
        },
      ],
      total: 1,
      page: 1,
      per_page: 20,
      source: "database",
    });
  });
});


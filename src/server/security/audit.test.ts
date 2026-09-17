import { afterEach, describe, expect, it } from "vitest";

import {
  recordSecurityAuditEvent,
  redactSecurityMetadata,
} from "./audit";

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

describe("security audit redaction", () => {
  it("redacts secret-shaped keys and bounds nested values", () => {
    const metadata = redactSecurityMetadata({
      reason: "missing_session",
      password: "do-not-store",
      authorization: "Bearer do-not-store",
      nested: { access_token: "do-not-store", method: "POST" },
      long_value: "x".repeat(600),
    });

    expect(metadata).toEqual({
      reason: "missing_session",
      password: "[REDACTED]",
      authorization: "[REDACTED]",
      nested: { access_token: "[REDACTED]", method: "POST" },
      long_value: "x".repeat(512),
    });
  });

  it("does not attempt persistence when the database is not configured", async () => {
    delete process.env.DATABASE_URL;

    await expect(
      recordSecurityAuditEvent({
        event_type: "authorization_denied",
        severity: "MEDIUM",
        outcome: "DENIED",
        request_id: "request-123",
        route_or_procedure: "pegawai.search",
        metadata: { token: "do-not-store" },
      }),
    ).resolves.toEqual({
      persisted: false,
      reason: "database_not_configured",
    });
  });
});


import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/server/db/prisma";

const sensitiveKeyPattern =
  /(authorization|cookie|password|token|secret|credential|api[_-]?key|private[_-]?key|access[_-]?token|refresh[_-]?token)/i;

const auditInputSchema = z.object({
  event_type: z.string().regex(/^[a-z0-9_.:-]{1,128}$/),
  severity: z.enum(["INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  outcome: z.enum(["SUCCESS", "DENIED", "FAILED", "BLOCKED", "DETECTED"]),
  actor_user_id: z.string().uuid().nullable().optional(),
  integration_id: z.string().uuid().nullable().optional(),
  request_id: z.string().regex(/^[A-Za-z0-9._:-]{1,128}$/),
  route_or_procedure: z.string().regex(/^[^?\r\n]{1,512}$/),
  target_type: z.string().max(128).nullable().optional(),
  target_id: z.string().max(128).nullable().optional(),
  metadata: z.unknown().optional(),
});

export type SecurityAuditEventInput = z.infer<typeof auditInputSchema>;

export type RedactedJson =
  | null
  | boolean
  | number
  | string
  | RedactedJson[]
  | { [key: string]: RedactedJson };

export type AuditWriteResult =
  | { persisted: true }
  | {
      persisted: false;
      reason: "database_not_configured" | "database_unavailable" | "invalid_event";
    };

function redactValue(value: unknown, depth: number, key?: string): RedactedJson | undefined {
  if (key && sensitiveKeyPattern.test(key)) {
    return "[REDACTED]";
  }

  if (depth > 4) {
    return "[TRUNCATED]";
  }

  if (value === null) return null;
  if (typeof value === "string") return value.slice(0, 512);
  if (typeof value === "boolean" || typeof value === "number") return value;

  if (Array.isArray(value)) {
    return value
      .slice(0, 20)
      .map((item) => redactValue(item, depth + 1))
      .filter((item): item is RedactedJson => item !== undefined);
  }

  if (typeof value === "object") {
    const result: { [key: string]: RedactedJson } = {};
    for (const [entryKey, entryValue] of Object.entries(value).slice(0, 40)) {
      const redacted = redactValue(entryValue, depth + 1, entryKey);
      if (redacted !== undefined) {
        result[entryKey.slice(0, 128)] = redacted;
      }
    }
    return result;
  }

  return "[UNSUPPORTED]";
}

export function redactSecurityMetadata(value: unknown): RedactedJson | undefined {
  return redactValue(value, 0);
}

export async function recordSecurityAuditEvent(
  input: SecurityAuditEventInput,
): Promise<AuditWriteResult> {
  const parsed = auditInputSchema.safeParse(input);
  if (!parsed.success) {
    return { persisted: false, reason: "invalid_event" };
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return { persisted: false, reason: "database_not_configured" };
  }

  const metadata = redactSecurityMetadata(parsed.data.metadata);

  try {
    await prisma.securityAuditEvent.create({
      data: {
        eventType: parsed.data.event_type,
        severity: parsed.data.severity,
        outcome: parsed.data.outcome,
        actorUserId: parsed.data.actor_user_id ?? null,
        integrationId: parsed.data.integration_id ?? null,
        requestId: parsed.data.request_id,
        routeOrProcedure: parsed.data.route_or_procedure,
        targetType: parsed.data.target_type ?? null,
        targetId: parsed.data.target_id ?? null,
        metadataRedactedJson: metadata as Prisma.InputJsonValue | undefined,
      },
    });

    return { persisted: true };
  } catch {
    // Audit failure must never expose database details to the request caller.
    return { persisted: false, reason: "database_unavailable" };
  }
}


import { z } from "zod";

import type { RedactedJson } from "@/server/security/audit";

const securitySeveritySchema = z.enum(["INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"]);
const securityOutcomeSchema = z.enum([
  "SUCCESS",
  "DENIED",
  "FAILED",
  "BLOCKED",
  "DETECTED",
]);
const redactedJsonSchema = z.custom<RedactedJson>(() => true);

export const securityAuditListInputSchema = z.object({
  event_type: z.string().regex(/^[a-z0-9_.:-]{1,128}$/).optional(),
  severity: securitySeveritySchema.optional(),
  outcome: securityOutcomeSchema.optional(),
  page: z.number().int().min(1).max(100).default(1),
  per_page: z.number().int().min(1).max(50).default(20),
});

export const securityAuditItemSchema = z.object({
  id: z.string().uuid(),
  event_type: z.string().min(1),
  severity: securitySeveritySchema,
  outcome: securityOutcomeSchema,
  actor_user_id: z.string().uuid().nullable(),
  request_id: z.string().min(1),
  route_or_procedure: z.string().min(1),
  target_type: z.string().nullable(),
  target_id: z.string().nullable(),
  metadata_redacted_json: redactedJsonSchema.nullable(),
  created_at: z.string().datetime(),
  reviewed_at: z.string().datetime().nullable(),
});

export const securityAuditListResponseSchema = z.object({
  items: z.array(securityAuditItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  source: z.enum(["database", "unavailable"]),
});

export type SecurityAuditListInput = z.infer<typeof securityAuditListInputSchema>;
export type SecurityAuditListResponse = z.infer<typeof securityAuditListResponseSchema>;

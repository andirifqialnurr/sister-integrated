import { z } from "zod";

export const overviewStatusSchema = z.object({
  request_id: z.string().min(1),
  checked_at: z.string().datetime(),
  environment: z.enum(["development", "production"]),
  auth_mode: z.enum(["development_fixture", "provider_required"]),
  session_state: z.enum(["present", "missing"]),
  database_state: z.enum(["configured", "not_configured"]),
  sister_mode: z.enum(["fixture", "live"]),
  sister_configuration: z.enum(["ready", "incomplete"]),
});

export type OverviewStatus = z.infer<typeof overviewStatusSchema>;


import { TRPCError } from "@trpc/server";

import { adminProcedure, createTRPCRouter } from "@/server/trpc/init";

import { listSecurityAudit } from "./security_audit_service";
import { securityAuditListInputSchema } from "../schema/security_audit_schema";

export const securityRouter = createTRPCRouter({
  audit_list: adminProcedure
    .input(securityAuditListInputSchema)
    .query(async ({ input }) => {
      try {
        return await listSecurityAudit(input);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Audit security tidak dapat dimuat",
        });
      }
    }),
});


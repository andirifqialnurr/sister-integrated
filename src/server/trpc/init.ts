import { initTRPC, TRPCError } from "@trpc/server";

import { recordSecurityAuditEvent } from "@/server/security/audit";

import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(async ({ ctx, next, path }) => {
  if (!ctx.user) {
    void recordSecurityAuditEvent({
      event_type: "authorization_denied",
      severity: "MEDIUM",
      outcome: "DENIED",
      request_id: ctx.requestId,
      route_or_procedure: path,
      metadata: {
        reason: "missing_session",
        method: ctx.request.method,
      },
    });

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication is required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

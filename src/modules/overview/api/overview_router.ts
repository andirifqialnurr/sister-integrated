import { createTRPCRouter, publicProcedure } from "@/server/trpc/init";

export const overviewRouter = createTRPCRouter({
  health: publicProcedure.query(({ ctx }) => ({
    ok: true,
    app: "sister-integrated",
    request_id: ctx.requestId,
    sister_connected: false,
  })),
});

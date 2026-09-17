import { createTRPCRouter } from "./init";
import { pegawaiRouter } from "@/modules/pegawai/api/pegawai_router";
import { overviewRouter } from "@/modules/overview/api/overview_router";

export const appRouter = createTRPCRouter({
  overview: overviewRouter,
  pegawai: pegawaiRouter,
});

export type AppRouter = typeof appRouter;

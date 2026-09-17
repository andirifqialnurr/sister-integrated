import { createTRPCRouter } from "./init";
import { pegawaiRouter } from "@/modules/pegawai/api/pegawai_router";
import { overviewRouter } from "@/modules/overview/api/overview_router";
import { referensiRouter } from "@/modules/referensi/api/referensi_router";
import { securityRouter } from "@/modules/security/api/security_router";

export const appRouter = createTRPCRouter({
  overview: overviewRouter,
  pegawai: pegawaiRouter,
  referensi: referensiRouter,
  security: securityRouter,
});

export type AppRouter = typeof appRouter;

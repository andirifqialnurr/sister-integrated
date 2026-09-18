import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { SisterApiError, SisterContractError } from "@/server/sister/errors";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init";

import {
  referensiUnitKerjaInputSchema,
  referensiWilayahInputSchema,
} from "../schema/referensi_schemas";
import {
  getPerguruanTinggi,
  getProfilPt,
  getSemester,
  getUnitKerja,
  getWilayah,
} from "./referensi_service";

const emptyInputSchema = z.object({});

function toSafeTrpcError(error: unknown): never {
  if (error instanceof SisterApiError) {
    const code =
      error.status === 401
        ? "UNAUTHORIZED"
        : error.status === 403
          ? "FORBIDDEN"
          : error.status === 404
            ? "NOT_FOUND"
            : "BAD_GATEWAY";

    throw new TRPCError({
      code,
      message: "Referensi SISTER tidak dapat dimuat saat ini",
    });
  }

  if (error instanceof SisterContractError) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Response referensi SISTER belum sesuai kontrak yang disetujui",
    });
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Permintaan referensi gagal diproses",
  });
}

export const referensiRouter = createTRPCRouter({
  get_profil_pt: protectedProcedure.input(emptyInputSchema).query(async () => {
    try {
      return await getProfilPt();
    } catch (error) {
      return toSafeTrpcError(error);
    }
  }),
  get_semester: protectedProcedure.input(emptyInputSchema).query(async () => {
    try {
      return await getSemester();
    } catch (error) {
      return toSafeTrpcError(error);
    }
  }),
  get_wilayah: protectedProcedure.input(referensiWilayahInputSchema).query(async ({ input }) => {
    try {
      return await getWilayah(input.id_level_wilayah);
    } catch (error) {
      return toSafeTrpcError(error);
    }
  }),
  get_perguruan_tinggi: protectedProcedure.input(emptyInputSchema).query(async () => {
    try {
      return await getPerguruanTinggi();
    } catch (error) {
      return toSafeTrpcError(error);
    }
  }),
  get_unit_kerja: protectedProcedure
    .input(referensiUnitKerjaInputSchema)
    .query(async ({ input }) => {
      try {
        return await getUnitKerja(input.id_perguruan_tinggi);
      } catch (error) {
        return toSafeTrpcError(error);
      }
    }),
});

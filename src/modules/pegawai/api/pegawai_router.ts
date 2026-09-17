import { TRPCError } from "@trpc/server";

import { SisterApiError, SisterContractError } from "@/server/sister/errors";
import { protectedProcedure, createTRPCRouter } from "@/server/trpc/init";

import { pegawaiIdInputSchema, pegawaiSearchInputSchema } from "./pegawai_schemas";
import { getPegawaiDetail, isPegawaiNotFoundError, searchPegawai } from "./pegawai_service";

function toSafeTrpcError(error: unknown): never {
  if (isPegawaiNotFoundError(error)) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Pegawai tidak ditemukan" });
  }

  if (error instanceof SisterApiError) {
    throw new TRPCError({
      code: error.status === 401 ? "UNAUTHORIZED" : "BAD_GATEWAY",
      message: "SISTER tidak dapat memenuhi permintaan saat ini",
    });
  }

  if (error instanceof SisterContractError) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Response SISTER belum sesuai kontrak yang disetujui",
    });
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Permintaan pegawai gagal diproses",
  });
}

export const pegawaiRouter = createTRPCRouter({
  search: protectedProcedure
    .input(pegawaiSearchInputSchema)
    .query(async ({ input }) => {
      try {
        return await searchPegawai(input);
      } catch (error) {
        return toSafeTrpcError(error);
      }
    }),
  get_detail: protectedProcedure
    .input(pegawaiIdInputSchema)
    .query(async ({ input }) => {
      try {
        return await getPegawaiDetail(input.id_sdm);
      } catch (error) {
        return toSafeTrpcError(error);
      }
    }),
});

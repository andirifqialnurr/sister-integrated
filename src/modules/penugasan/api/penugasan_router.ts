import { TRPCError } from "@trpc/server";

import { SisterApiError, SisterContractError, SisterNotFoundError } from "@/server/sister/errors";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init";

import {
  penugasanIdInputSchema,
  penugasanSdmInputSchema,
} from "./penugasan_schemas";
import { getPenugasanDetail, getPenugasanList } from "./penugasan_service";

function toSafeTrpcError(error: unknown): never {
  if (error instanceof SisterNotFoundError) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Penugasan tidak ditemukan" });
  }

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
      message: "Data penugasan SISTER tidak dapat dimuat saat ini",
    });
  }

  if (error instanceof SisterContractError) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Response penugasan SISTER belum sesuai kontrak yang disetujui",
    });
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Permintaan penugasan gagal diproses",
  });
}

async function runPenugasanQuery<T>(query: () => Promise<T>) {
  try {
    return await query();
  } catch (error) {
    return toSafeTrpcError(error);
  }
}

export const penugasanRouter = createTRPCRouter({
  list: protectedProcedure
    .input(penugasanSdmInputSchema)
    .query(({ input }) => runPenugasanQuery(() => getPenugasanList(input))),
  get_detail: protectedProcedure
    .input(penugasanIdInputSchema)
    .query(({ input }) => runPenugasanQuery(() => getPenugasanDetail(input))),
});

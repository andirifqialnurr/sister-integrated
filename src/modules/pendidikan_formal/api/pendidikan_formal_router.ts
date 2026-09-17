import { TRPCError } from "@trpc/server";

import { SisterApiError, SisterContractError, SisterNotFoundError } from "@/server/sister/errors";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init";

import {
  pendidikanFormalIdInputSchema,
  pendidikanFormalSdmInputSchema,
} from "./pendidikan_formal_schemas";
import {
  getPendidikanFormalDetail,
  getPendidikanFormalList,
} from "./pendidikan_formal_service";

function toSafeTrpcError(error: unknown): never {
  if (error instanceof SisterNotFoundError) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Pendidikan formal tidak ditemukan",
    });
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
      message: "Data pendidikan formal SISTER tidak dapat dimuat saat ini",
    });
  }

  if (error instanceof SisterContractError) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Response pendidikan formal SISTER belum sesuai kontrak yang disetujui",
    });
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Permintaan pendidikan formal gagal diproses",
  });
}

async function runPendidikanFormalQuery<T>(query: () => Promise<T>) {
  try {
    return await query();
  } catch (error) {
    return toSafeTrpcError(error);
  }
}

export const pendidikanFormalRouter = createTRPCRouter({
  list: protectedProcedure
    .input(pendidikanFormalSdmInputSchema)
    .query(({ input }) => runPendidikanFormalQuery(() => getPendidikanFormalList(input))),
  get_detail: protectedProcedure
    .input(pendidikanFormalIdInputSchema)
    .query(({ input }) => runPendidikanFormalQuery(() => getPendidikanFormalDetail(input))),
});

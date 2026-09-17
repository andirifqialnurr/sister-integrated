import { TRPCError } from "@trpc/server";

import { SisterApiError, SisterContractError, SisterNotFoundError } from "@/server/sister/errors";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init";

import {
  riwayatPekerjaanIdInputSchema,
  riwayatPekerjaanSdmInputSchema,
} from "./riwayat_pekerjaan_schemas";
import {
  getRiwayatPekerjaanDetail,
  getRiwayatPekerjaanList,
} from "./riwayat_pekerjaan_service";

function toSafeTrpcError(error: unknown): never {
  if (error instanceof SisterNotFoundError) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Riwayat pekerjaan tidak ditemukan",
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
      message: "Data riwayat pekerjaan SISTER tidak dapat dimuat saat ini",
    });
  }

  if (error instanceof SisterContractError) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Response riwayat pekerjaan SISTER belum sesuai kontrak yang disetujui",
    });
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Permintaan riwayat pekerjaan gagal diproses",
  });
}

async function runRiwayatPekerjaanQuery<T>(query: () => Promise<T>) {
  try {
    return await query();
  } catch (error) {
    return toSafeTrpcError(error);
  }
}

export const riwayatPekerjaanRouter = createTRPCRouter({
  list: protectedProcedure
    .input(riwayatPekerjaanSdmInputSchema)
    .query(({ input }) => runRiwayatPekerjaanQuery(() => getRiwayatPekerjaanList(input))),
  get_detail: protectedProcedure
    .input(riwayatPekerjaanIdInputSchema)
    .query(({ input }) => runRiwayatPekerjaanQuery(() => getRiwayatPekerjaanDetail(input))),
});

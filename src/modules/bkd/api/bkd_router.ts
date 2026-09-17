import { TRPCError } from "@trpc/server";

import { SisterApiError, SisterContractError, SisterNotFoundError } from "@/server/sister/errors";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init";

import {
  bkdSemesterInputSchema,
  bkdSdmInputSchema,
} from "./bkd_schemas";
import {
  getBkdAjar,
  getBkdLaporanAkhir,
  getBkdPendidikan,
  getBkdPengmas,
  getBkdPenelitian,
  getBkdTunjang,
} from "./bkd_service";

function toSafeTrpcError(error: unknown): never {
  if (error instanceof SisterNotFoundError) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Data BKD tidak ditemukan" });
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
      message: "Data BKD SISTER tidak dapat dimuat saat ini",
    });
  }

  if (error instanceof SisterContractError) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Response BKD SISTER belum sesuai kontrak yang disetujui",
    });
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Permintaan BKD gagal diproses",
  });
}

async function runBkdQuery<T>(query: () => Promise<T>) {
  try {
    return await query();
  } catch (error) {
    return toSafeTrpcError(error);
  }
}

export const bkdRouter = createTRPCRouter({
  laporan_akhir: protectedProcedure
    .input(bkdSdmInputSchema)
    .query(({ input }) => runBkdQuery(() => getBkdLaporanAkhir(input))),
  pendidikan: protectedProcedure
    .input(bkdSemesterInputSchema)
    .query(({ input }) => runBkdQuery(() => getBkdPendidikan(input))),
  ajar: protectedProcedure
    .input(bkdSemesterInputSchema)
    .query(({ input }) => runBkdQuery(() => getBkdAjar(input))),
  tunjang: protectedProcedure
    .input(bkdSemesterInputSchema)
    .query(({ input }) => runBkdQuery(() => getBkdTunjang(input))),
  pengmas: protectedProcedure
    .input(bkdSemesterInputSchema)
    .query(({ input }) => runBkdQuery(() => getBkdPengmas(input))),
  penelitian: protectedProcedure
    .input(bkdSemesterInputSchema)
    .query(({ input }) => runBkdQuery(() => getBkdPenelitian(input))),
});

import { z } from "zod";

import {
  penugasanDetailSchema,
  penugasanSummarySchema,
} from "@/server/sister/types";

const sourceSchema = z.enum(["fixture", "sister"]);

export const penugasanSdmInputSchema = z.object({
  id_sdm: z.string().uuid(),
});

export const penugasanIdInputSchema = z.object({
  id_penugasan: z.string().uuid(),
});

export const penugasanSummaryDtoSchema = penugasanSummarySchema
  .pick({
    id: true,
    status_kepegawaian: true,
    ikatan_kerja: true,
    unit_kerja: true,
    jenjang_pendidikan: true,
    perguruan_tinggi: true,
    tanggal_mulai: true,
    tanggal_keluar: true,
  })
  .strict();

export const penugasanDetailDtoSchema = penugasanDetailSchema
  .pick({
    id: true,
    status_kepegawaian: true,
    ikatan_kerja: true,
    unit_kerja: true,
    jenjang_pendidikan: true,
    perguruan_tinggi: true,
    tanggal_mulai: true,
    tanggal_keluar: true,
    id_sdm: true,
    surat_tugas: true,
    tanggal_surat_tugas: true,
    jenis_keluar: true,
    id_jenis_keluar: true,
    id_status_kepegawaian: true,
    id_ikatan_kerja: true,
    id_perguruan_tinggi: true,
    id_unit_kerja: true,
  })
  .strict();

export const penugasanListResponseSchema = z.object({
  items: z.array(penugasanSummaryDtoSchema),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export const penugasanDetailResponseSchema = z.object({
  item: penugasanDetailDtoSchema,
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export type PenugasanSdmInput = z.infer<typeof penugasanSdmInputSchema>;
export type PenugasanIdInput = z.infer<typeof penugasanIdInputSchema>;
export type PenugasanListResponse = z.infer<typeof penugasanListResponseSchema>;
export type PenugasanDetailResponse = z.infer<typeof penugasanDetailResponseSchema>;

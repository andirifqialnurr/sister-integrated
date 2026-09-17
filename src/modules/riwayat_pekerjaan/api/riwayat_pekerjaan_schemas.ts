import { z } from "zod";

import {
  riwayatPekerjaanDetailSchema,
  riwayatPekerjaanDocumentSchema,
  riwayatPekerjaanSummarySchema,
} from "@/server/sister/types";

const sourceSchema = z.enum(["fixture", "sister"]);

export const riwayatPekerjaanSdmInputSchema = z.object({
  id_sdm: z.string().uuid(),
});

export const riwayatPekerjaanIdInputSchema = z.object({
  id_riwayat_pekerjaan: z.string().uuid(),
});

export const riwayatPekerjaanSummaryDtoSchema = riwayatPekerjaanSummarySchema
  .pick({
    id: true,
    jenis_pekerjaan: true,
    nama_jabatan: true,
    instansi: true,
    divisi: true,
    mulai_bekerja: true,
    selesai_bekerja: true,
    luar_negeri: true,
    bidang_usaha: true,
  })
  .strict();

export const riwayatPekerjaanDocumentDtoSchema = riwayatPekerjaanDocumentSchema
  .pick({
    id: true,
    nama: true,
    jenis_dokumen: true,
    nama_file: true,
    jenis_file: true,
    tanggal_upload: true,
    tautan: true,
    keterangan: true,
  })
  .strict();

export const riwayatPekerjaanDetailDtoSchema = riwayatPekerjaanDetailSchema
  .pick({
    id: true,
    jenis_pekerjaan: true,
    nama_jabatan: true,
    instansi: true,
    divisi: true,
    mulai_bekerja: true,
    selesai_bekerja: true,
    luar_negeri: true,
    bidang_usaha: true,
    id_sdm: true,
    id_bidang_usaha: true,
    id_jenis_pekerjaan: true,
    deskripsi_kerja: true,
    dokumen: true,
  })
  .extend({
    dokumen: z.array(riwayatPekerjaanDocumentDtoSchema),
  })
  .strict();

export const riwayatPekerjaanListResponseSchema = z.object({
  items: z.array(riwayatPekerjaanSummaryDtoSchema),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export const riwayatPekerjaanDetailResponseSchema = z.object({
  item: riwayatPekerjaanDetailDtoSchema,
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export type RiwayatPekerjaanSdmInput = z.infer<typeof riwayatPekerjaanSdmInputSchema>;
export type RiwayatPekerjaanIdInput = z.infer<typeof riwayatPekerjaanIdInputSchema>;
export type RiwayatPekerjaanListResponse = z.infer<
  typeof riwayatPekerjaanListResponseSchema
>;
export type RiwayatPekerjaanDetailResponse = z.infer<
  typeof riwayatPekerjaanDetailResponseSchema
>;

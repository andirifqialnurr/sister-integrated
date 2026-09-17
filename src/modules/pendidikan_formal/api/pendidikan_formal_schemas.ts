import { z } from "zod";

import {
  pendidikanFormalDetailSchema,
  pendidikanFormalDocumentSchema,
  pendidikanFormalSummarySchema,
} from "@/server/sister/types";

const sourceSchema = z.enum(["fixture", "sister"]);

export const pendidikanFormalSdmInputSchema = z.object({
  id_sdm: z.string().uuid(),
});

export const pendidikanFormalIdInputSchema = z.object({
  id_pendidikan_formal: z.string().uuid(),
});

export const pendidikanFormalSummaryDtoSchema = pendidikanFormalSummarySchema
  .pick({
    id: true,
    jenjang_pendidikan: true,
    gelar_akademik: true,
    bidang_studi: true,
    nama_perguruan_tinggi: true,
    tahun_lulus: true,
    jenis_ajuan: true,
  })
  .strict();

export const pendidikanFormalDocumentDtoSchema = pendidikanFormalDocumentSchema
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

export const pendidikanFormalDetailDtoSchema = pendidikanFormalDetailSchema
  .pick({
    id: true,
    jenjang_pendidikan: true,
    gelar_akademik: true,
    bidang_studi: true,
    nama_perguruan_tinggi: true,
    tahun_lulus: true,
    jenis_ajuan: true,
    kategori_kegiatan: true,
    id_sdm: true,
    id_program_studi: true,
    nama_program_studi: true,
    id_jenjang_pendidikan: true,
    id_gelar_akademik: true,
    id_bidang_studi: true,
    tahun_masuk: true,
    tanggal_lulus: true,
    nomor_induk: true,
    jumlah_semester: true,
    jumlah_sks: true,
    ipk: true,
    sk_penyetaraan: true,
    tanggal_sk_penyetaraan: true,
    nomor_ijazah: true,
    judul_tugas_akhir: true,
    dokumen: true,
  })
  .extend({
    dokumen: z.array(pendidikanFormalDocumentDtoSchema),
  })
  .strict();

export const pendidikanFormalListResponseSchema = z.object({
  items: z.array(pendidikanFormalSummaryDtoSchema),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export const pendidikanFormalDetailResponseSchema = z.object({
  item: pendidikanFormalDetailDtoSchema,
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export type PendidikanFormalSdmInput = z.infer<typeof pendidikanFormalSdmInputSchema>;
export type PendidikanFormalIdInput = z.infer<typeof pendidikanFormalIdInputSchema>;
export type PendidikanFormalListResponse = z.infer<
  typeof pendidikanFormalListResponseSchema
>;
export type PendidikanFormalDetailResponse = z.infer<
  typeof pendidikanFormalDetailResponseSchema
>;

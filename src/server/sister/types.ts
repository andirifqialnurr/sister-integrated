import { z } from "zod";

const nullableText = z.string().nullable().optional().transform((value) => value ?? null);

export const authorizeResponseSchema = z
  .object({
    token: z.string().min(1),
    role: z.string().min(1),
  })
  .passthrough();

export const sdmSummarySchema = z
  .object({
    id_sdm: z.string().min(1),
    nama_sdm: z.string().min(1),
    nidn: nullableText,
    nip: nullableText,
    nuptk: nullableText,
    nama_status_aktif: nullableText,
    nama_status_pegawai: nullableText,
    jenis_sdm: nullableText,
  })
  .passthrough();

export const sdmSummaryListSchema = z.array(sdmSummarySchema);

export const sdmProfileSchema = z
  .object({
    nama: z.string().min(1),
    jenis_kelamin: z.string().min(1),
    tempat_lahir: z.string().min(1),
    tanggal_lahir: z.string().min(1),
  })
  .passthrough();

export const sdmEmploymentSchema = z
  .object({
    nip: nullableText,
    sk_cpns: nullableText,
    tanggal_sk_cpns: nullableText,
    sk_tmmd: nullableText,
    tmmd: nullableText,
    id_sumber_gaji: z.number().int().nullable().optional().transform((value) => value ?? null),
    sumber_gaji: nullableText,
    nidn: nullableText,
    nuptk: nullableText,
  })
  .passthrough();

export const profilPtSchema = z
  .object({
    id: z.string(),
    kode_perguruan_tinggi: z.string(),
    nama_perguruan_tinggi: z.string(),
    telepon: z.string(),
    faximile: z.string(),
    email: z.string(),
    website: z.string(),
    jalan: z.string(),
    dusun: z.string(),
    rt: z.number().int(),
    rw: z.number().int(),
    kelurahan: z.string(),
    kode_pos: z.string(),
    id_wilayah: z.string(),
  })
  .passthrough();

export const profilPtListSchema = z.array(profilPtSchema);

export const semesterSchema = z
  .object({
    id: z.number().int(),
    nama: z.string(),
  })
  .passthrough();

export const semesterListSchema = z.array(semesterSchema);

export type SdmSummary = z.infer<typeof sdmSummarySchema>;
export type SdmProfile = z.infer<typeof sdmProfileSchema>;
export type SdmEmployment = z.infer<typeof sdmEmploymentSchema>;
export type ProfilPt = z.infer<typeof profilPtSchema>;
export type Semester = z.infer<typeof semesterSchema>;

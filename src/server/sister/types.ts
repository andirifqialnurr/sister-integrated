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

export const bkdLaporanAkhirSchema = z
  .object({
    id_reg_ptk: z.string().uuid(),
    id_smt: z.string(),
    sks_kinerja_ajar: z.number(),
    sks_lebih_ajar: z.number(),
    sks_kinerja_didik: z.number(),
    sks_lebih_didik: z.number(),
    sks_kinerja_lit: z.number(),
    sks_lebih_lit: z.number(),
    sks_kinerja_pengmas: z.number(),
    sks_lebih_pengmas: z.number(),
    sks_kinerja_penunjang: z.number(),
    sks_lebih_tunjang: z.number(),
    sks_kinerja: z.number(),
    sks_lebih: z.number(),
    stat_kewajiban: z.number(),
    stat_tugas: z.string(),
    stat_belajar: z.string(),
    id_jabfung: z.number(),
    simpulan_asesor: z.string(),
  })
  .passthrough();

export const bkdLaporanAkhirListSchema = z.array(bkdLaporanAkhirSchema);

export const bkdActivitySchema = z
  .object({
    nm_sdm: z.string(),
    nidn: z.string(),
    id_smt: z.string(),
    unsur: z.string(),
    judul_keg: z.string(),
    id_katgiat: z.number().int(),
    nm_kat: z.string(),
    beban_sks: z.number(),
    nilai: z.number(),
  })
  .passthrough();

export const bkdActivityListSchema = z.array(bkdActivitySchema);

export const penugasanSummarySchema = z
  .object({
    id: z.string().min(1),
    status_kepegawaian: z.string(),
    ikatan_kerja: z.string(),
    unit_kerja: z.string(),
    jenjang_pendidikan: z.string(),
    perguruan_tinggi: z.string(),
    tanggal_mulai: z.string(),
    tanggal_keluar: z.string(),
  })
  .passthrough();

export const penugasanSummaryListSchema = z.array(penugasanSummarySchema);

export const penugasanDetailSchema = penugasanSummarySchema
  .extend({
    id_sdm: z.string(),
    surat_tugas: z.string(),
    tanggal_surat_tugas: z.string(),
    jenis_keluar: z.string(),
    id_jenis_keluar: z.string(),
    id_status_kepegawaian: z.number().int(),
    id_ikatan_kerja: z.string(),
    id_perguruan_tinggi: z.string(),
    id_unit_kerja: z.string(),
  })
  .passthrough();

export const pendidikanFormalDocumentSchema = z
  .object({
    id: z.string().min(1),
    nama: z.string(),
    jenis_dokumen: z.string(),
    nama_file: z.string(),
    jenis_file: z.string(),
    tanggal_upload: z.string(),
    tautan: z.string(),
    keterangan: z.string(),
  })
  .passthrough();

const pendidikanFormalBaseSchema = z.object({
  id: z.string().min(1),
  jenjang_pendidikan: z.string(),
  gelar_akademik: z.string(),
  bidang_studi: z.string(),
  nama_perguruan_tinggi: z.string(),
  tahun_lulus: z.number().int(),
});

export const pendidikanFormalSummarySchema = pendidikanFormalBaseSchema
  .extend({
    jenis_ajuan: z.number().int(),
  })
  .passthrough();

export const pendidikanFormalSummaryListSchema = z.array(pendidikanFormalSummarySchema);

export const pendidikanFormalDetailSchema = pendidikanFormalBaseSchema
  .extend({
    jenis_ajuan: z.string(),
    kategori_kegiatan: z.string(),
    id_sdm: z.string(),
    id_program_studi: z.string(),
    nama_program_studi: z.string(),
    id_jenjang_pendidikan: z.number().int(),
    id_gelar_akademik: z.number().int(),
    id_bidang_studi: z.number().int(),
    tahun_masuk: z.number().int(),
    tanggal_lulus: z.string(),
    nomor_induk: z.string(),
    jumlah_semester: z.number().int(),
    jumlah_sks: z.number().int(),
    ipk: z.number(),
    sk_penyetaraan: z.string(),
    tanggal_sk_penyetaraan: z.string(),
    nomor_ijazah: z.string(),
    judul_tugas_akhir: z.string(),
    dokumen: z.array(pendidikanFormalDocumentSchema),
  })
  .passthrough();

export type SdmSummary = z.infer<typeof sdmSummarySchema>;
export type SdmProfile = z.infer<typeof sdmProfileSchema>;
export type SdmEmployment = z.infer<typeof sdmEmploymentSchema>;
export type ProfilPt = z.infer<typeof profilPtSchema>;
export type Semester = z.infer<typeof semesterSchema>;
export type BkdLaporanAkhir = z.infer<typeof bkdLaporanAkhirSchema>;
export type BkdActivity = z.infer<typeof bkdActivitySchema>;
export type PenugasanSummary = z.infer<typeof penugasanSummarySchema>;
export type PenugasanDetail = z.infer<typeof penugasanDetailSchema>;
export type PendidikanFormalDocument = z.infer<typeof pendidikanFormalDocumentSchema>;
export type PendidikanFormalSummary = z.infer<typeof pendidikanFormalSummarySchema>;
export type PendidikanFormalDetail = z.infer<typeof pendidikanFormalDetailSchema>;

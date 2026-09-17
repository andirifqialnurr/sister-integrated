import { z } from "zod";

import {
  bkdActivitySchema,
  bkdLaporanAkhirSchema,
} from "@/server/sister/types";

const sourceSchema = z.enum(["fixture", "sister"]);
const semesterIdSchema = z.string().trim().min(1).max(32).regex(/^\d+$/);

export const bkdSdmInputSchema = z.object({
  id_sdm: z.string().uuid(),
});

export const bkdSemesterInputSchema = bkdSdmInputSchema.extend({
  id_smt: semesterIdSchema,
});

export const bkdLaporanAkhirResponseSchema = z.object({
  items: z.array(bkdLaporanAkhirSchema.pick({
    id_reg_ptk: true,
    id_smt: true,
    sks_kinerja_ajar: true,
    sks_lebih_ajar: true,
    sks_kinerja_didik: true,
    sks_lebih_didik: true,
    sks_kinerja_lit: true,
    sks_lebih_lit: true,
    sks_kinerja_pengmas: true,
    sks_lebih_pengmas: true,
    sks_kinerja_penunjang: true,
    sks_lebih_tunjang: true,
    sks_kinerja: true,
    sks_lebih: true,
    stat_kewajiban: true,
    stat_tugas: true,
    stat_belajar: true,
    id_jabfung: true,
    simpulan_asesor: true,
  }).strict()),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export const bkdActivityResponseSchema = z.object({
  items: z.array(bkdActivitySchema.pick({
    nm_sdm: true,
    nidn: true,
    id_smt: true,
    unsur: true,
    judul_keg: true,
    id_katgiat: true,
    nm_kat: true,
    beban_sks: true,
    nilai: true,
  }).strict()),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export type BkdSdmInput = z.infer<typeof bkdSdmInputSchema>;
export type BkdSemesterInput = z.infer<typeof bkdSemesterInputSchema>;
export type BkdLaporanAkhirResponse = z.infer<typeof bkdLaporanAkhirResponseSchema>;
export type BkdActivityResponse = z.infer<typeof bkdActivityResponseSchema>;

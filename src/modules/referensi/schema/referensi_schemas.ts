import { z } from "zod";

import {
  perguruanTinggiSchema,
  profilPtSchema,
  semesterSchema,
  unitKerjaSchema,
  wilayahSchema,
} from "@/server/sister/types";

const sourceSchema = z.enum(["fixture", "sister"]);

export const referensiWilayahLevelSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const referensiWilayahInputSchema = z.object({
  id_level_wilayah: referensiWilayahLevelSchema,
});

export const referensiUnitKerjaInputSchema = z.object({
  id_perguruan_tinggi: z.string().uuid(),
});

export const referensiProfilPtItemSchema = profilPtSchema
  .pick({
    id: true,
    kode_perguruan_tinggi: true,
    nama_perguruan_tinggi: true,
    telepon: true,
    faximile: true,
    email: true,
    website: true,
    jalan: true,
    dusun: true,
    rt: true,
    rw: true,
    kelurahan: true,
    kode_pos: true,
    id_wilayah: true,
  })
  .strict();

export const referensiSemesterItemSchema = semesterSchema
  .pick({ id: true, nama: true })
  .strict();

export const referensiWilayahItemSchema = wilayahSchema
  .pick({ id: true, nama: true, id_induk_wilayah: true })
  .strict();

export const referensiPerguruanTinggiItemSchema = perguruanTinggiSchema
  .pick({ id: true, nama: true })
  .strict();

export const referensiUnitKerjaItemSchema = unitKerjaSchema
  .pick({ id: true, nama: true, id_jenis_unit: true })
  .strict();

export const referensiProfilPtResponseSchema = z.object({
  items: z.array(referensiProfilPtItemSchema),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export const referensiSemesterResponseSchema = z.object({
  items: z.array(referensiSemesterItemSchema),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export const referensiWilayahResponseSchema = z.object({
  items: z.array(referensiWilayahItemSchema),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export const referensiPerguruanTinggiResponseSchema = z.object({
  items: z.array(referensiPerguruanTinggiItemSchema),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export const referensiUnitKerjaResponseSchema = z.object({
  items: z.array(referensiUnitKerjaItemSchema),
  source: sourceSchema,
  fetched_at: z.string().datetime(),
});

export type ReferensiWilayahInput = z.infer<typeof referensiWilayahInputSchema>;
export type ReferensiUnitKerjaInput = z.infer<typeof referensiUnitKerjaInputSchema>;
export type ReferensiProfilPtResponse = z.infer<typeof referensiProfilPtResponseSchema>;
export type ReferensiSemesterResponse = z.infer<typeof referensiSemesterResponseSchema>;
export type ReferensiWilayahResponse = z.infer<typeof referensiWilayahResponseSchema>;
export type ReferensiPerguruanTinggiResponse = z.infer<
  typeof referensiPerguruanTinggiResponseSchema
>;
export type ReferensiUnitKerjaResponse = z.infer<typeof referensiUnitKerjaResponseSchema>;

import { z } from "zod";

import { profilPtSchema, semesterSchema } from "@/server/sister/types";

const sourceSchema = z.enum(["fixture", "sister"]);

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

export type ReferensiProfilPtResponse = z.infer<typeof referensiProfilPtResponseSchema>;
export type ReferensiSemesterResponse = z.infer<typeof referensiSemesterResponseSchema>;

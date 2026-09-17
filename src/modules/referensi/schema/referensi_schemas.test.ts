import { describe, expect, it } from "vitest";

import { profilPtListSchema, semesterListSchema } from "@/server/sister/types";

import {
  referensiProfilPtItemSchema,
  referensiSemesterItemSchema,
} from "./referensi_schemas";

const profilPt = {
  id: "pt-1",
  kode_perguruan_tinggi: "123456",
  nama_perguruan_tinggi: "Perguruan Tinggi Uji",
  telepon: "021000000",
  faximile: "021000001",
  email: "pt@example.test",
  website: "https://example.test",
  jalan: "Jalan Uji",
  dusun: "Dusun Uji",
  rt: 1,
  rw: 2,
  kelurahan: "Kelurahan Uji",
  kode_pos: "12345",
  id_wilayah: "010101",
};

describe("SISTER referensi schemas", () => {
  it("accepts the documented PT response types", () => {
    expect(profilPtListSchema.safeParse([profilPt]).success).toBe(true);
    expect(referensiProfilPtItemSchema.parse(profilPt)).toEqual(profilPt);
  });

  it("rejects wrong PT numeric types and extra DTO fields", () => {
    expect(
      profilPtListSchema.safeParse([{ ...profilPt, rt: "1" }]).success,
    ).toBe(false);
    expect(
      referensiProfilPtItemSchema.safeParse({ ...profilPt, undocumented: "x" }).success,
    ).toBe(false);
  });

  it("accepts integer semester IDs and rejects non-integer IDs", () => {
    expect(semesterListSchema.safeParse([{ id: 20251, nama: "Ganjil" }]).success).toBe(true);
    expect(referensiSemesterItemSchema.parse({ id: 20251, nama: "Ganjil" })).toEqual({
      id: 20251,
      nama: "Ganjil",
    });
    expect(semesterListSchema.safeParse([{ id: "20251", nama: "Ganjil" }]).success).toBe(false);
    expect(
      referensiSemesterItemSchema.safeParse({ id: 20251, nama: "Ganjil", extra: true }).success,
    ).toBe(false);
  });
});

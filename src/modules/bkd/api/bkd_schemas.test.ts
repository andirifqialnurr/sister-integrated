import { describe, expect, it } from "vitest";

import {
  bkdActivityResponseSchema,
  bkdSemesterInputSchema,
  bkdSdmInputSchema,
} from "./bkd_schemas";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";

describe("BKD schemas", () => {
  it("accepts the documented SDM and semester query shape", () => {
    expect(bkdSdmInputSchema.parse({ id_sdm: idSdm })).toEqual({ id_sdm: idSdm });
    expect(bkdSemesterInputSchema.parse({ id_sdm: idSdm, id_smt: "20251" })).toEqual({
      id_sdm: idSdm,
      id_smt: "20251",
    });
  });

  it("rejects arbitrary identifiers and non-numeric semester values", () => {
    expect(bkdSdmInputSchema.safeParse({ id_sdm: "not-a-uuid" }).success).toBe(false);
    expect(
      bkdSemesterInputSchema.safeParse({ id_sdm: idSdm, id_smt: "semester-ganjil" }).success,
    ).toBe(false);
  });

  it("keeps the activity response DTO limited to documented fields", () => {
    const result = bkdActivityResponseSchema.safeParse({
      items: [
        {
          nm_sdm: "Aditya Pratama",
          nidn: "032999923",
          id_smt: "20251",
          unsur: "Penelitian",
          judul_keg: "Kegiatan Fixture",
          id_katgiat: 1,
          nm_kat: "Penelitian Fixture",
          beban_sks: 2,
          nilai: 2,
          internal_note: "must not be in DTO",
        },
      ],
      source: "fixture",
      fetched_at: "2026-09-17T00:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });
});

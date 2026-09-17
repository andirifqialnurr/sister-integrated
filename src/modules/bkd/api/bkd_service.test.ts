import { afterEach, describe, expect, it } from "vitest";

import { FixtureBkdAdapter } from "./bkd_adapter";
import {
  getBkdAjar,
  getBkdLaporanAkhir,
  getBkdPendidikan,
  getBkdPengmas,
  getBkdPenelitian,
  getBkdTunjang,
} from "./bkd_service";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const input = { id_sdm: idSdm, id_smt: "20251" };
const originalFixtureMode = process.env.SISTER_FIXTURE_MODE;

afterEach(() => {
  if (originalFixtureMode === undefined) {
    delete process.env.SISTER_FIXTURE_MODE;
  } else {
    process.env.SISTER_FIXTURE_MODE = originalFixtureMode;
  }
});

describe("BKD service", () => {
  it("returns safe report DTO data", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const result = await getBkdLaporanAkhir({ id_sdm: idSdm }, new FixtureBkdAdapter());

    expect(result.source).toBe("fixture");
    expect(result.items[0]).toMatchObject({
      id_reg_ptk: "a1f00000-0000-4000-8000-000000000001",
      id_smt: "20251",
      sks_kinerja: 12,
    });
  });

  it("exposes all five activity reads through the same safe response contract", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    const adapter = new FixtureBkdAdapter();

    const results = await Promise.all([
      getBkdPendidikan(input, adapter),
      getBkdAjar(input, adapter),
      getBkdTunjang(input, adapter),
      getBkdPengmas(input, adapter),
      getBkdPenelitian(input, adapter),
    ]);

    expect(results.map((result) => result.source)).toEqual([
      "fixture",
      "fixture",
      "fixture",
      "fixture",
      "fixture",
    ]);
    expect(results.map((result) => result.items[0]?.id_smt)).toEqual([
      "20251",
      "20251",
      "20251",
      "20251",
      "20251",
    ]);
  });
});

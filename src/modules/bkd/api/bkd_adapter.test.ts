import { describe, expect, it, vi } from "vitest";

const sisterGetMock = vi.hoisted(() => vi.fn());

vi.mock("@/server/sister/http_client", () => ({
  sisterGet: sisterGetMock,
}));

import { FixtureBkdAdapter, SisterBkdAdapter } from "./bkd_adapter";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const input = { id_sdm: idSdm, id_smt: "20251" };

describe("FixtureBkdAdapter", () => {
  it("returns a synthetic report and activity using the selected context", async () => {
    const adapter = new FixtureBkdAdapter();

    const report = await adapter.getLaporanAkhir({ id_sdm: idSdm });
    const activity = await adapter.getPenelitian(input);

    expect(report[0]).toMatchObject({
      id_smt: "20251",
      stat_tugas: "Memenuhi",
      sks_kinerja: 12,
    });
    expect(activity[0]).toMatchObject({
      nm_sdm: "Aditya Pratama",
      nidn: "032999923",
      id_smt: "20251",
      unsur: "Penelitian",
    });
  });

  it("rejects an SDM that did not come from the fixture reference", async () => {
    await expect(
      new FixtureBkdAdapter().getLaporanAkhir({
        id_sdm: "00000000-0000-4000-8000-000000000099",
      }),
    ).rejects.toThrow("SISTER resource was not found");
  });
});

describe("SisterBkdAdapter", () => {
  it("uses only the six documented BKD paths and their documented query fields", async () => {
    sisterGetMock.mockResolvedValue([]);
    const adapter = new SisterBkdAdapter();

    await Promise.all([
      adapter.getLaporanAkhir({ id_sdm: idSdm }),
      adapter.getPendidikan(input),
      adapter.getAjar(input),
      adapter.getTunjang(input),
      adapter.getPengmas(input),
      adapter.getPenelitian(input),
    ]);

    const calls = sisterGetMock.mock.calls.map(([options]) => options);
    expect(calls.map((options) => options.path).sort()).toEqual([
      "/bkd/ajar",
      "/bkd/laporan_akhir_bkd",
      "/bkd/pendidikan",
      "/bkd/penelitian",
      "/bkd/pengmas",
      "/bkd/tunjang",
    ]);
    expect(calls.find((options) => options.path === "/bkd/laporan_akhir_bkd").query).toEqual({
      id_sdm: idSdm,
    });
    expect(calls.find((options) => options.path === "/bkd/pendidikan").query).toEqual({
      id_sdm: idSdm,
      id_smt: "20251",
    });
  });
});

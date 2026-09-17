import { describe, expect, it } from "vitest";

import { FixturePegawaiAdapter } from "./pegawai_adapter";

const adapter = new FixturePegawaiAdapter();

describe("FixturePegawaiAdapter", () => {
  it("searches by the selected SISTER identifier field", async () => {
    const result = await adapter.search({
      search_by: "nip",
      search: "19850101",
      page: 1,
      per_page: 20,
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.nama_sdm).toBe("Aditya Pratama");
  });

  it("returns a safe empty result for an unknown query", async () => {
    const result = await adapter.search({
      search_by: "nama",
      search: "Tidak Ada",
      page: 1,
      per_page: 20,
    });

    expect(result).toEqual([]);
  });

  it("rejects a detail request for an unknown SDM", async () => {
    await expect(
      adapter.getProfile("00000000-0000-4000-8000-000000000099"),
    ).rejects.toThrow("SISTER resource was not found");
  });
});

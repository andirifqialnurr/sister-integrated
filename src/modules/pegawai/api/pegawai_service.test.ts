import { afterEach, describe, expect, it, vi } from "vitest";

import { FixturePegawaiAdapter } from "./pegawai_adapter";
import { getPegawaiDetail, searchPegawai } from "./pegawai_service";

const adapter = new FixturePegawaiAdapter();
const originalIntegrationId = process.env.SISTER_INTEGRATION_ID;

afterEach(() => {
  if (originalIntegrationId === undefined) {
    delete process.env.SISTER_INTEGRATION_ID;
  } else {
    process.env.SISTER_INTEGRATION_ID = originalIntegrationId;
  }
});

describe("pegawai service", () => {
  it("returns only the safe summary DTO fields", async () => {
    const result = await searchPegawai(
      {
        search_by: "nama",
        search: "Aditya",
        page: 1,
        per_page: 20,
      },
      adapter,
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({
      id_sdm: "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62",
      nama_sdm: "Aditya Pratama",
      nidn: "032999923",
      nip: "198501012010011001",
      nuptk: "4723786869032232",
      nama_status_aktif: "Aktif",
      nama_status_pegawai: "Dosen Tetap",
      jenis_sdm: "Dosen",
    });
  });

  it("combines profile and employment data for detail", async () => {
    const result = await getPegawaiDetail(
      "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62",
      adapter,
    );

    expect(result.profile.nama).toBe("Aditya Pratama");
    expect(result.employment.sumber_gaji).toBe("Yayasan");
    expect(result.source).toBe("fixture");
  });

  it("writes only summary data to the configured cache repository", async () => {
    process.env.SISTER_INTEGRATION_ID = "00000000-0000-4000-8000-000000000002";
    const cacheRepository = {
      findFreshById: vi.fn(),
      upsertMany: vi.fn().mockResolvedValue(undefined),
    };

    await searchPegawai(
      {
        search_by: "nama",
        search: "Aditya",
        page: 1,
        per_page: 20,
      },
      adapter,
      cacheRepository,
    );

    expect(cacheRepository.upsertMany).toHaveBeenCalledWith(
      "00000000-0000-4000-8000-000000000002",
      [
        expect.objectContaining({
          id_sdm: "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62",
          nama_sdm: "Aditya Pratama",
        }),
      ],
    );
  });
});

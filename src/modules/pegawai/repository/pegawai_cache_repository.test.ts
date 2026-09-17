import { describe, expect, it, vi } from "vitest";

import {
  PrismaPegawaiCacheRepository,
  type PegawaiCacheClient,
} from "./pegawai_cache_repository";

const summary = {
  id_sdm: "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62",
  nama_sdm: "Aditya Pratama",
  nidn: "032999923",
  nip: "198501012010011001",
  nuptk: "4723786869032232",
  nama_status_aktif: "Aktif",
  nama_status_pegawai: "Dosen Tetap",
  jenis_sdm: "Dosen",
};

function makeClient(findUnique: ReturnType<typeof vi.fn> = vi.fn()) {
  return {
    sisterSdmIndexCache: {
      findUnique,
      upsert: vi.fn().mockResolvedValue({}),
    },
  } as unknown as PegawaiCacheClient;
}

describe("PrismaPegawaiCacheRepository", () => {
  it("returns a fresh cache row as the documented SISTER summary shape", async () => {
    const findUnique = vi.fn().mockResolvedValue({
      integrationId: "00000000-0000-4000-8000-000000000002",
      idSdm: summary.id_sdm,
      namaSdm: summary.nama_sdm,
      nidn: summary.nidn,
      nip: summary.nip,
      nuptk: summary.nuptk,
      namaStatusAktif: summary.nama_status_aktif,
      namaStatusPegawai: summary.nama_status_pegawai,
      jenisSdm: summary.jenis_sdm,
      fetchedAt: new Date(),
    });
    const repository = new PrismaPegawaiCacheRepository(makeClient(findUnique));

    await expect(
      repository.findFreshById(
        "00000000-0000-4000-8000-000000000002",
        summary.id_sdm,
        300_000,
      ),
    ).resolves.toEqual(summary);
    expect(findUnique).toHaveBeenCalledWith({
      where: {
        integrationId_idSdm: {
          integrationId: "00000000-0000-4000-8000-000000000002",
          idSdm: summary.id_sdm,
        },
      },
    });
  });

  it("does not serve a stale row", async () => {
    const findUnique = vi.fn().mockResolvedValue({
      ...summary,
      idSdm: summary.id_sdm,
      namaSdm: summary.nama_sdm,
      namaStatusAktif: summary.nama_status_aktif,
      namaStatusPegawai: summary.nama_status_pegawai,
      jenisSdm: summary.jenis_sdm,
      fetchedAt: new Date(Date.now() - 301_000),
    });
    const repository = new PrismaPegawaiCacheRepository(makeClient(findUnique));

    await expect(
      repository.findFreshById(
        "00000000-0000-4000-8000-000000000002",
        summary.id_sdm,
        300_000,
      ),
    ).resolves.toBeNull();
  });

  it("upserts only the summary fields needed by the local cache", async () => {
    const client = makeClient();
    const repository = new PrismaPegawaiCacheRepository(client);

    await repository.upsertMany(
      "00000000-0000-4000-8000-000000000002",
      [summary],
    );

    expect(client.sisterSdmIndexCache.upsert).toHaveBeenCalledWith({
      where: {
        integrationId_idSdm: {
          integrationId: "00000000-0000-4000-8000-000000000002",
          idSdm: summary.id_sdm,
        },
      },
      create: {
        integrationId: "00000000-0000-4000-8000-000000000002",
        idSdm: summary.id_sdm,
        namaSdm: summary.nama_sdm,
        nidn: summary.nidn,
        nip: summary.nip,
        nuptk: summary.nuptk,
        namaStatusAktif: summary.nama_status_aktif,
        namaStatusPegawai: summary.nama_status_pegawai,
        jenisSdm: summary.jenis_sdm,
      },
      update: expect.objectContaining({
        namaSdm: summary.nama_sdm,
        fetchedAt: expect.any(Date),
      }),
    });
  });
});

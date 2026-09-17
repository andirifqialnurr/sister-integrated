import { describe, expect, it, vi } from "vitest";

const sisterGetMock = vi.hoisted(() => vi.fn());

vi.mock("@/server/sister/http_client", () => ({
  sisterGet: sisterGetMock,
}));

import {
  FixtureRiwayatPekerjaanAdapter,
  SisterRiwayatPekerjaanAdapter,
} from "./riwayat_pekerjaan_adapter";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const idRiwayatPekerjaan = "c3f00000-0000-4000-8000-000000000001";

describe("FixtureRiwayatPekerjaanAdapter", () => {
  it("returns list and detail for a selected fixture SDM", async () => {
    const adapter = new FixtureRiwayatPekerjaanAdapter();

    const list = await adapter.getList({ id_sdm: idSdm });
    const detail = await adapter.getDetail({
      id_riwayat_pekerjaan: idRiwayatPekerjaan,
    });

    expect(list[0]).toMatchObject({
      id: idRiwayatPekerjaan,
      jenis_pekerjaan: "Dosen",
      luar_negeri: false,
    });
    expect(detail).toMatchObject({
      id: idRiwayatPekerjaan,
      id_sdm: idSdm,
      id_bidang_usaha: 1,
    });
  });

  it("returns an empty list for a known SDM without work history", async () => {
    const list = await new FixtureRiwayatPekerjaanAdapter().getList({
      id_sdm: "d2f2e4c7-0d62-4ef0-8e88-f0af9e6247c5",
    });

    expect(list).toEqual([]);
  });

  it("rejects an unknown work history identifier", async () => {
    await expect(
      new FixtureRiwayatPekerjaanAdapter().getDetail({
        id_riwayat_pekerjaan: "00000000-0000-4000-8000-000000000099",
      }),
    ).rejects.toThrow("SISTER resource was not found");
  });
});

describe("SisterRiwayatPekerjaanAdapter", () => {
  it("uses only the documented list and detail paths", async () => {
    sisterGetMock.mockResolvedValueOnce([]).mockResolvedValueOnce({});
    const adapter = new SisterRiwayatPekerjaanAdapter();

    await adapter.getList({ id_sdm: idSdm });
    await adapter.getDetail({ id_riwayat_pekerjaan: idRiwayatPekerjaan });

    expect(sisterGetMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        path: "/riwayat_pekerjaan",
        query: { id_sdm: idSdm },
      }),
    );
    expect(sisterGetMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        path: `/riwayat_pekerjaan/${idRiwayatPekerjaan}`,
      }),
    );
    expect(sisterGetMock.mock.calls[1]?.[0]).not.toHaveProperty("query");
  });
});

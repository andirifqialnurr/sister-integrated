import { describe, expect, it, vi } from "vitest";

const sisterGetMock = vi.hoisted(() => vi.fn());

vi.mock("@/server/sister/http_client", () => ({
  sisterGet: sisterGetMock,
}));

import { FixturePenugasanAdapter, SisterPenugasanAdapter } from "./penugasan_adapter";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const idPenugasan = "b1f00000-0000-4000-8000-000000000001";

describe("FixturePenugasanAdapter", () => {
  it("returns list and detail data for the selected synthetic SDM", async () => {
    const adapter = new FixturePenugasanAdapter();

    const list = await adapter.getList({ id_sdm: idSdm });
    const detail = await adapter.getDetail({ id_penugasan: idPenugasan });

    expect(list).toEqual([
      expect.objectContaining({
        id: idPenugasan,
        status_kepegawaian: "Aktif",
        unit_kerja: "Unit Kerja Fixture",
      }),
    ]);
    expect(detail).toMatchObject({
      id: idPenugasan,
      id_sdm: idSdm,
      surat_tugas: "ST/FIXTURE/001",
    });
  });

  it("rejects an assignment that is not in the fixture reference", async () => {
    await expect(
      new FixturePenugasanAdapter().getDetail({
        id_penugasan: "00000000-0000-4000-8000-000000000099",
      }),
    ).rejects.toThrow("SISTER resource was not found");
  });
});

describe("SisterPenugasanAdapter", () => {
  it("uses the documented list and detail paths", async () => {
    sisterGetMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({ id: idPenugasan });
    const adapter = new SisterPenugasanAdapter();

    await adapter.getList({ id_sdm: idSdm });
    await adapter.getDetail({ id_penugasan: idPenugasan });

    expect(sisterGetMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        path: "/penugasan",
        query: { id_sdm: idSdm },
      }),
    );
    expect(sisterGetMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        path: `/penugasan/${idPenugasan}`,
      }),
    );
    expect(sisterGetMock.mock.calls[1]?.[0]).not.toHaveProperty("query");
  });
});

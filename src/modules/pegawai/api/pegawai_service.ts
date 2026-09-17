import { getSisterConfig } from "@/server/sister/config";
import { SisterNotFoundError } from "@/server/sister/errors";
import type { SdmSummary } from "@/server/sister/types";

import {
  FixturePegawaiAdapter,
  SisterPegawaiAdapter,
  type PegawaiDataSource,
} from "./pegawai_adapter";
import {
  pegawaiDetailResponseSchema,
  pegawaiSearchResponseSchema,
  type PegawaiDetailResponse,
  type PegawaiSearchInput,
  type PegawaiSearchResponse,
} from "./pegawai_schemas";

function createPegawaiDataSource(): PegawaiDataSource {
  return getSisterConfig().fixture_mode
    ? new FixturePegawaiAdapter()
    : new SisterPegawaiAdapter();
}

function toSafeSummary(summary: SdmSummary) {
  return {
    id_sdm: summary.id_sdm,
    nama_sdm: summary.nama_sdm,
    nidn: summary.nidn,
    nip: summary.nip,
    nuptk: summary.nuptk,
    nama_status_aktif: summary.nama_status_aktif,
    nama_status_pegawai: summary.nama_status_pegawai,
    jenis_sdm: summary.jenis_sdm,
  };
}

export async function searchPegawai(
  input: PegawaiSearchInput,
  dataSource: PegawaiDataSource = createPegawaiDataSource(),
): Promise<PegawaiSearchResponse> {
  const allResults = await dataSource.search({ ...input, page: 1, per_page: 50 });
  const offset = (input.page - 1) * input.per_page;
  const pageItems = allResults.slice(offset, offset + input.per_page).map(toSafeSummary);

  return pegawaiSearchResponseSchema.parse({
    items: pageItems,
    total: allResults.length,
    page: input.page,
    per_page: input.per_page,
    source: getSisterConfig().fixture_mode ? "fixture" : "sister",
    fetched_at: new Date().toISOString(),
  });
}

export async function getPegawaiDetail(
  idSdm: string,
  dataSource: PegawaiDataSource = createPegawaiDataSource(),
): Promise<PegawaiDetailResponse> {
  const summaryList = await dataSource.search({
    search_by: "nama",
    search: "",
    page: 1,
    per_page: 50,
  });
  const summary = summaryList.find((item) => item.id_sdm === idSdm);

  if (!summary) {
    throw new SisterNotFoundError();
  }

  const [profile, employment] = await Promise.all([
    dataSource.getProfile(idSdm),
    dataSource.getEmployment(idSdm),
  ]);

  return pegawaiDetailResponseSchema.parse({
    summary: toSafeSummary(summary),
    profile,
    employment,
    source: getSisterConfig().fixture_mode ? "fixture" : "sister",
    fetched_at: new Date().toISOString(),
  });
}

export function isPegawaiNotFoundError(error: unknown) {
  return error instanceof SisterNotFoundError;
}

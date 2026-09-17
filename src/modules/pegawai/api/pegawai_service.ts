import { getSisterConfig } from "@/server/sister/config";
import { SisterNotFoundError } from "@/server/sister/errors";
import type { SdmSummary } from "@/server/sister/types";

import {
  PrismaPegawaiCacheRepository,
  type PegawaiCacheRepository,
} from "../repository/pegawai_cache_repository";
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

function createPegawaiCacheRepository(): PegawaiCacheRepository | null {
  const config = getSisterConfig();
  if (config.fixture_mode || !config.integration_id || !process.env.DATABASE_URL?.trim()) {
    return null;
  }

  return new PrismaPegawaiCacheRepository();
}

async function writeSummaryCache(
  cacheRepository: PegawaiCacheRepository | null,
  integrationId: string | null,
  items: SdmSummary[],
) {
  if (!cacheRepository || !integrationId || items.length === 0) {
    return;
  }

  try {
    await cacheRepository.upsertMany(integrationId, items);
  } catch {
    // Cache failure must not turn a successful read from SISTER into an error.
  }
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
  cacheRepository: PegawaiCacheRepository | null = createPegawaiCacheRepository(),
): Promise<PegawaiSearchResponse> {
  const config = getSisterConfig();
  const allResults = await dataSource.search({ ...input, page: 1, per_page: 50 });
  await writeSummaryCache(cacheRepository, config.integration_id, allResults);
  const offset = (input.page - 1) * input.per_page;
  const pageItems = allResults.slice(offset, offset + input.per_page).map(toSafeSummary);

  return pegawaiSearchResponseSchema.parse({
    items: pageItems,
    total: allResults.length,
    page: input.page,
    per_page: input.per_page,
    source: config.fixture_mode ? "fixture" : "sister",
    fetched_at: new Date().toISOString(),
  });
}

export async function getPegawaiDetail(
  idSdm: string,
  dataSource: PegawaiDataSource = createPegawaiDataSource(),
  cacheRepository: PegawaiCacheRepository | null = createPegawaiCacheRepository(),
): Promise<PegawaiDetailResponse> {
  const config = getSisterConfig();
  let summary: SdmSummary | undefined;

  if (cacheRepository && config.integration_id) {
    try {
      summary =
        (await cacheRepository.findFreshById(
          config.integration_id,
          idSdm,
          config.sdm_cache_ttl_ms,
        )) ?? undefined;
    } catch {
      summary = undefined;
    }
  }

  if (!summary) {
    const summaryList = await dataSource.search({
      search_by: "nama",
      search: "",
      page: 1,
      per_page: 50,
    });
    await writeSummaryCache(cacheRepository, config.integration_id, summaryList);
    summary = summaryList.find((item) => item.id_sdm === idSdm);
  }

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
    source: config.fixture_mode ? "fixture" : "sister",
    fetched_at: new Date().toISOString(),
  });
}

export function isPegawaiNotFoundError(error: unknown) {
  return error instanceof SisterNotFoundError;
}

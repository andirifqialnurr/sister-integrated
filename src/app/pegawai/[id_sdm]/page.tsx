import { PegawaiDetailPage } from "@/modules/pegawai/page/pegawai_detail_page";

export default async function PegawaiDetailRoute({
  params,
}: {
  params: Promise<{ id_sdm: string }>;
}) {
  const { id_sdm: idSdm } = await params;
  return <PegawaiDetailPage idSdm={idSdm} />;
}

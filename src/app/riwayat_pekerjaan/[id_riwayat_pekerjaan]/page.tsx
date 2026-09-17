import { RiwayatPekerjaanDetailPage } from "@/modules/riwayat_pekerjaan/page/riwayat_pekerjaan_detail_page";

type PageProps = {
  params: Promise<{
    id_riwayat_pekerjaan: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id_riwayat_pekerjaan } = await params;

  return <RiwayatPekerjaanDetailPage idRiwayatPekerjaan={id_riwayat_pekerjaan} />;
}

import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/component/widget";
import type { RiwayatPekerjaanListResponse } from "../api/riwayat_pekerjaan_schemas";

type RiwayatPekerjaanItem = RiwayatPekerjaanListResponse["items"][number];

type RiwayatPekerjaanTableProps = {
  items: RiwayatPekerjaanListResponse["items"];
};

export function RiwayatPekerjaanTable({ items }: RiwayatPekerjaanTableProps) {
  const columns: DataTableColumn<RiwayatPekerjaanItem>[] = [
    {
      key: "position",
      header: "Jabatan",
      render: (item) => (
        <span className="font-medium text-[hsl(var(--color-text))]">{item.nama_jabatan}</span>
      ),
    },
    {
      key: "job-type",
      header: "Jenis pekerjaan",
      render: (item) => <span className="text-[hsl(var(--color-muted))]">{item.jenis_pekerjaan}</span>,
    },
    {
      key: "institution",
      header: "Instansi",
      render: (item) => <span className="text-[hsl(var(--color-muted))]">{item.instansi}</span>,
    },
    {
      key: "division",
      header: "Divisi",
      render: (item) => <span className="text-[hsl(var(--color-muted))]">{item.divisi || "-"}</span>,
    },
    {
      key: "start",
      header: "Mulai",
      render: (item) => (
        <span className="text-[hsl(var(--color-muted))]">{item.mulai_bekerja || "-"}</span>
      ),
    },
    {
      key: "end",
      header: "Selesai",
      render: (item) => (
        <span className="text-[hsl(var(--color-muted))]">{item.selesai_bekerja || "-"}</span>
      ),
    },
    {
      key: "international",
      header: "Luar negeri",
      render: (item) => <span className="text-[hsl(var(--color-muted))]">{item.luar_negeri ? "Ya" : "Tidak"}</span>,
    },
    {
      key: "business-field",
      header: "Bidang usaha",
      render: (item) => <span className="text-[hsl(var(--color-muted))]">{item.bidang_usaha}</span>,
    },
    {
      key: "action",
      header: "Detail",
      className: "text-right",
      render: (item) => (
        <Link
          aria-label={`Buka detail riwayat pekerjaan ${item.nama_jabatan}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] transition-colors hover:text-[hsl(var(--color-primary-strong))]"
          href={`/riwayat_pekerjaan/${item.id}`}
        >
          Detail
          <ExternalLink aria-hidden size={13} />
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      caption="Daftar riwayat pekerjaan"
      columns={columns}
      getRowKey={(item) => item.id}
      rows={items}
      tableClassName="min-w-[980px]"
    />
  );
}

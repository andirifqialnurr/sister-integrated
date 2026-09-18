import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/component/widget";
import type { PenugasanListResponse } from "../api/penugasan_schemas";

type PenugasanItem = PenugasanListResponse["items"][number];

type PenugasanTableProps = {
  items: PenugasanListResponse["items"];
};

export function PenugasanTable({ items }: PenugasanTableProps) {
  const columns: DataTableColumn<PenugasanItem>[] = [
    {
      key: "employment",
      header: "Status / ikatan kerja",
      render: (item) => (
        <>
          <p className="font-semibold text-[hsl(var(--color-text))]">
            {item.status_kepegawaian || "Tidak tersedia"}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
            {item.ikatan_kerja || "Ikatan kerja tidak tersedia"}
          </p>
        </>
      ),
    },
    {
      key: "unit",
      header: "Unit kerja",
      render: (item) => item.unit_kerja || "Tidak tersedia",
    },
    {
      key: "education-level",
      header: "Jenjang",
      render: (item) => (
        <span className="text-xs text-[hsl(var(--color-muted))]">
          {item.jenjang_pendidikan || "Tidak tersedia"}
        </span>
      ),
    },
    {
      key: "institution",
      header: "Perguruan tinggi",
      render: (item) => (
        <span className="text-xs text-[hsl(var(--color-muted))]">
          {item.perguruan_tinggi || "Tidak tersedia"}
        </span>
      ),
    },
    {
      key: "period",
      header: "Periode",
      render: (item) => (
        <div className="text-xs text-[hsl(var(--color-muted))]">
          <p>Mulai: {item.tanggal_mulai || "Tidak tersedia"}</p>
          <p className="mt-1">Keluar: {item.tanggal_keluar || "Belum keluar"}</p>
        </div>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      className: "text-right",
      render: (item) => (
        <Link
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] transition-colors hover:text-[hsl(var(--color-primary-strong))]"
          href={`/penugasan/${item.id}`}
        >
          Lihat detail
          <ArrowUpRight aria-hidden size={14} />
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      caption="Daftar penugasan dan penempatan SDM"
      columns={columns}
      getRowKey={(item) => item.id}
      rows={items}
      tableClassName="min-w-[920px]"
    />
  );
}

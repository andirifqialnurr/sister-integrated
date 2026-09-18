import { DataTable, type DataTableColumn } from "@/component/widget";

import type { ReferensiSemesterResponse } from "../schema/referensi_schemas";

type SemesterItem = ReferensiSemesterResponse["items"][number];

type SemesterTableProps = {
  items: ReferensiSemesterResponse["items"];
};

export function SemesterTable({ items }: SemesterTableProps) {
  const columns: DataTableColumn<SemesterItem>[] = [
    {
      key: "id",
      header: "ID semester",
      render: (item) => item.id,
      className: "font-mono text-xs text-[hsl(var(--color-muted))]",
    },
    {
      key: "nama",
      header: "Nama semester",
      render: (item) => item.nama,
      className: "font-medium text-[hsl(var(--color-text))]",
    },
  ];

  return (
    <DataTable
      caption="Daftar semester dari SISTER"
      columns={columns}
      getRowKey={(item) => item.id}
      rows={items}
      tableClassName="min-w-[420px]"
    />
  );
}

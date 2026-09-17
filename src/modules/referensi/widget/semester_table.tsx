import type { ReferensiSemesterResponse } from "../schema/referensi_schemas";

type SemesterTableProps = {
  items: ReferensiSemesterResponse["items"];
};

export function SemesterTable({ items }: SemesterTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <caption className="sr-only">Daftar semester dari SISTER</caption>
        <thead className="border-b border-[hsl(var(--color-border))] text-xs text-[hsl(var(--color-muted))]">
          <tr>
            <th className="px-5 py-3 font-semibold" scope="col">
              ID semester
            </th>
            <th className="px-5 py-3 font-semibold" scope="col">
              Nama semester
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[hsl(var(--color-border))]">
          {items.map((semester) => (
            <tr key={semester.id}>
              <td className="px-5 py-4 font-mono text-xs text-[hsl(var(--color-muted))]">
                {semester.id}
              </td>
              <td className="px-5 py-4 font-medium text-[hsl(var(--color-text))]">
                {semester.nama}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

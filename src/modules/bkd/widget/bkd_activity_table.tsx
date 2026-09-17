import type { BkdActivityResponse } from "../api/bkd_schemas";

type BkdActivityTableProps = {
  items: BkdActivityResponse["items"];
};

export function BkdActivityTable({ items }: BkdActivityTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1080px] text-left text-sm">
        <caption className="sr-only">Daftar aktivitas BKD</caption>
        <thead className="border-b border-[hsl(var(--color-border))] text-xs text-[hsl(var(--color-muted))]">
          <tr>
            <th className="px-4 py-3 font-semibold" scope="col">
              SDM
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Semester
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Unsur
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Judul kegiatan
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Kategori
            </th>
            <th className="px-4 py-3 text-right font-semibold" scope="col">
              Beban SKS
            </th>
            <th className="px-4 py-3 text-right font-semibold" scope="col">
              Nilai
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[hsl(var(--color-border))]">
          {items.map((item, index) => (
            <tr key={`${item.id_smt}-${item.id_katgiat}-${index}`}>
              <td className="px-4 py-4">
                <p className="font-medium text-[hsl(var(--color-text))]">{item.nm_sdm}</p>
                <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">NIDN: {item.nidn}</p>
              </td>
              <td className="px-4 py-4 font-mono text-xs text-[hsl(var(--color-muted))]">
                {item.id_smt}
              </td>
              <td className="px-4 py-4 text-xs text-[hsl(var(--color-muted))]">{item.unsur}</td>
              <td className="max-w-xs px-4 py-4 text-sm text-[hsl(var(--color-text))]">
                {item.judul_keg}
              </td>
              <td className="px-4 py-4 text-xs text-[hsl(var(--color-muted))]">
                <p>{item.nm_kat}</p>
                <p className="mt-1 font-mono">ID {item.id_katgiat}</p>
              </td>
              <td className="px-4 py-4 text-right font-mono text-xs text-[hsl(var(--color-text))]">
                {formatNumber(item.beban_sks)}
              </td>
              <td className="px-4 py-4 text-right font-mono text-xs text-[hsl(var(--color-text))]">
                {formatNumber(item.nilai)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

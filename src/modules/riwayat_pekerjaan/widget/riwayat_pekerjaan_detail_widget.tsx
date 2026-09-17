import { BriefcaseBusiness, FileText } from "lucide-react";

import type { RiwayatPekerjaanDetailResponse } from "../api/riwayat_pekerjaan_schemas";

type RiwayatPekerjaanDetailWidgetProps = {
  item: RiwayatPekerjaanDetailResponse["item"];
};

function DetailField({ label, value }: { label: string; value: string | number | boolean }) {
  const displayValue =
    typeof value === "boolean" ? (value ? "Ya" : "Tidak") : value || "-";

  return (
    <div className="border-b border-[hsl(var(--color-border))] py-3 last:border-b-0">
      <dt className="text-xs text-[hsl(var(--color-muted))]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[hsl(var(--color-text))]">
        {displayValue}
      </dd>
    </div>
  );
}

export function RiwayatPekerjaanDetailWidget({ item }: RiwayatPekerjaanDetailWidgetProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-6 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
            <BriefcaseBusiness aria-hidden size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--color-primary))]">
              Riwayat Pekerjaan
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--color-text))]">
              {item.nama_jabatan}
            </h1>
            <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">{item.instansi}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
          <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">Data pekerjaan</h2>
          <dl className="mt-4">
            <DetailField label="Jenis pekerjaan" value={item.jenis_pekerjaan} />
            <DetailField label="Jabatan" value={item.nama_jabatan} />
            <DetailField label="Instansi" value={item.instansi} />
            <DetailField label="Divisi" value={item.divisi} />
            <DetailField label="Bidang usaha" value={item.bidang_usaha} />
            <DetailField label="Luar negeri" value={item.luar_negeri} />
          </dl>
        </section>

        <section className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
          <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">Detail SISTER</h2>
          <dl className="mt-4">
            <DetailField label="ID SDM" value={item.id_sdm} />
            <DetailField label="ID bidang usaha" value={item.id_bidang_usaha} />
            <DetailField label="ID jenis pekerjaan" value={item.id_jenis_pekerjaan} />
            <DetailField label="Mulai bekerja" value={item.mulai_bekerja} />
            <DetailField label="Selesai bekerja" value={item.selesai_bekerja} />
            <DetailField label="Deskripsi kerja" value={item.deskripsi_kerja} />
          </dl>
        </section>
      </div>

      <section className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
        <div className="flex items-center gap-2">
          <FileText aria-hidden className="text-[hsl(var(--color-primary))]" size={17} />
          <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">Metadata dokumen</h2>
        </div>
        {item.dokumen.length === 0 ? (
          <p className="mt-4 text-sm text-[hsl(var(--color-muted))]">
            Tidak ada metadata dokumen pada detail ini.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.08em] text-[hsl(var(--color-muted))]">
                <tr>
                  <th className="border-b border-[hsl(var(--color-border))] py-2 font-semibold">Nama</th>
                  <th className="border-b border-[hsl(var(--color-border))] py-2 font-semibold">Jenis</th>
                  <th className="border-b border-[hsl(var(--color-border))] py-2 font-semibold">File</th>
                  <th className="border-b border-[hsl(var(--color-border))] py-2 font-semibold">Upload</th>
                  <th className="border-b border-[hsl(var(--color-border))] py-2 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--color-border))]">
                {item.dokumen.map((document) => (
                  <tr key={document.id}>
                    <td className="py-3 pr-4 font-medium text-[hsl(var(--color-text))]">
                      {document.nama}
                    </td>
                    <td className="py-3 pr-4 text-[hsl(var(--color-muted))]">
                      {document.jenis_dokumen}
                    </td>
                    <td className="py-3 pr-4 text-[hsl(var(--color-muted))]">
                      {document.nama_file || document.tautan || "-"}
                    </td>
                    <td className="py-3 pr-4 text-[hsl(var(--color-muted))]">
                      {document.tanggal_upload || "-"}
                    </td>
                    <td className="py-3 pr-4 text-[hsl(var(--color-muted))]">
                      {document.keterangan || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

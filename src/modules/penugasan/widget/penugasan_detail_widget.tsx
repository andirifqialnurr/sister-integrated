import type { PenugasanDetailResponse } from "../api/penugasan_schemas";

type PenugasanDetailWidgetProps = {
  item: PenugasanDetailResponse["item"];
};

export function PenugasanDetailWidget({ item }: PenugasanDetailWidgetProps) {
  return (
    <article className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)] sm:p-6">
      <div className="flex flex-col justify-between gap-3 border-b border-[hsl(var(--color-border))] pb-5 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold text-[hsl(var(--color-text))]">Detail penugasan</p>
          <p className="mt-1 font-mono text-xs text-[hsl(var(--color-muted))]">{item.id}</p>
        </div>
        <span className="rounded-lg bg-[hsl(var(--color-primary-soft))] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--color-primary-strong))]">
          {item.status_kepegawaian || "Status tidak tersedia"}
        </span>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        <DetailField label="ID SDM" value={item.id_sdm} />
        <DetailField label="Ikatan kerja" value={item.ikatan_kerja} />
        <DetailField label="Unit kerja" value={item.unit_kerja} />
        <DetailField label="Jenjang pendidikan" value={item.jenjang_pendidikan} />
        <DetailField label="Perguruan tinggi" value={item.perguruan_tinggi} />
        <DetailField label="Tanggal mulai" value={item.tanggal_mulai} />
        <DetailField label="Tanggal keluar" value={item.tanggal_keluar} />
        <DetailField label="Surat tugas" value={item.surat_tugas} />
        <DetailField label="Tanggal surat tugas" value={item.tanggal_surat_tugas} />
        <DetailField label="Jenis keluar" value={item.jenis_keluar} />
        <DetailField label="ID jenis keluar" value={item.id_jenis_keluar} />
        <DetailField label="ID status kepegawaian" value={String(item.id_status_kepegawaian)} />
        <DetailField label="ID ikatan kerja" value={item.id_ikatan_kerja} />
        <DetailField label="ID perguruan tinggi" value={item.id_perguruan_tinggi} />
        <DetailField label="ID unit kerja" value={item.id_unit_kerja} />
      </dl>
    </article>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--color-muted))]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-[hsl(var(--color-text))]">
        {value || "Tidak tersedia"}
      </dd>
    </div>
  );
}

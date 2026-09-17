import type { ReferensiProfilPtResponse } from "../schema/referensi_schemas";

type ProfilPt = ReferensiProfilPtResponse["items"][number];

type ProfilPtWidgetProps = {
  items: ProfilPt[];
};

export function ProfilPtWidget({ items }: ProfilPtWidgetProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((profile) => (
        <article
          className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]"
          key={profile.id}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[hsl(var(--color-text))]">
                {profile.nama_perguruan_tinggi || "Nama PT tidak tersedia"}
              </p>
              <p className="mt-1 font-mono text-xs text-[hsl(var(--color-muted))]">
                {profile.kode_perguruan_tinggi || "Kode PT tidak tersedia"}
              </p>
            </div>
            <span className="rounded-lg bg-[hsl(var(--color-primary-soft))] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--color-primary-strong))]">
              Profil PT
            </span>
          </div>

          <dl className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <ProfilField label="ID PT" value={profile.id} />
            <ProfilField label="ID wilayah" value={profile.id_wilayah} />
            <ProfilField label="Telepon" value={profile.telepon} />
            <ProfilField label="Faximile" value={profile.faximile} />
            <ProfilField label="Email" value={profile.email} />
            <ProfilField label="Website" value={profile.website} />
            <ProfilField label="Jalan" value={profile.jalan} />
            <ProfilField label="Dusun" value={profile.dusun} />
            <ProfilField label="RT / RW" value={`${profile.rt} / ${profile.rw}`} />
            <ProfilField label="Kelurahan" value={profile.kelurahan} />
            <ProfilField label="Kode pos" value={profile.kode_pos} />
          </dl>
        </article>
      ))}
    </div>
  );
}

function ProfilField({ label, value }: { label: string; value: string }) {
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

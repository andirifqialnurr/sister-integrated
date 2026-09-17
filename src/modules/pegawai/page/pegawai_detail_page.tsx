"use client";

import Link from "next/link";

import { ArrowLeft, BriefcaseBusiness, CircleAlert, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { StatusBadge } from "@/component/ui/status_badge";
import { Sidebar } from "@/component/ui/sidebar";
import { useTRPC } from "@/lib/trpc";

type PegawaiDetailPageProps = {
  idSdm: string;
};

function DetailField({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border-b border-[hsl(var(--color-border))] py-3 last:border-b-0">
      <dt className="text-xs text-[hsl(var(--color-muted))]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[hsl(var(--color-text))]">{value || "—"}</dd>
    </div>
  );
}

export function PegawaiDetailPage({ idSdm }: PegawaiDetailPageProps) {
  const trpc = useTRPC();
  const detailQuery = useQuery(trpc.pegawai.get_detail.queryOptions({ id_sdm: idSdm }));

  return (
    <div className="flex min-h-screen">
      <Sidebar activeLabel="Pegawai" />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--color-border))] bg-white px-5 sm:px-8">
          <Link
            className="inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--color-muted))] transition-colors hover:text-[hsl(var(--color-primary))]"
            href="/pegawai"
          >
            <ArrowLeft aria-hidden size={15} />
            Kembali ke daftar pegawai
          </Link>
          <StatusBadge tone="neutral">Read-only</StatusBadge>
        </header>

        <main className="mx-auto max-w-[1100px] space-y-6 p-5 sm:p-8">
          {detailQuery.isPending && (
            <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">
              Memuat detail pegawai...
            </div>
          )}

          {detailQuery.isError && (
            <div className="rounded-xl border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-5 text-sm text-[hsl(var(--color-danger-strong))]">
              Detail pegawai tidak dapat dimuat. Pastikan ID berasal dari hasil
              pencarian dan session memiliki akses read-only.
            </div>
          )}

          {detailQuery.data && (
            <>
              <section className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-6 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
                      <UserRound aria-hidden size={25} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--color-primary))]">
                        Detail SDM
                      </p>
                      <h1 className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--color-text))]">
                        {detailQuery.data.summary.nama_sdm}
                      </h1>
                      <p className="mt-1 font-mono text-xs text-[hsl(var(--color-muted))]">
                        {detailQuery.data.summary.id_sdm}
                      </p>
                    </div>
                  </div>
                  <StatusBadge tone="success">
                    {detailQuery.data.summary.nama_status_aktif ?? "Status tidak tersedia"}
                  </StatusBadge>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-[hsl(var(--color-muted))]">
                  <span className="rounded-full bg-[hsl(var(--color-canvas))] px-3 py-1.5">
                    {detailQuery.data.summary.jenis_sdm ?? "Jenis tidak tersedia"}
                  </span>
                  <span className="rounded-full bg-[hsl(var(--color-canvas))] px-3 py-1.5">
                    {detailQuery.data.summary.nama_status_pegawai ?? "Status pegawai tidak tersedia"}
                  </span>
                </div>
              </section>

              <div className="grid gap-6 md:grid-cols-2">
                <section className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
                  <div className="flex items-center gap-2">
                    <UserRound aria-hidden className="text-[hsl(var(--color-primary))]" size={17} />
                    <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">Profil</h2>
                  </div>
                  <dl className="mt-4">
                    <DetailField label="Nama" value={detailQuery.data.profile.nama} />
                    <DetailField
                      label="Jenis kelamin"
                      value={detailQuery.data.profile.jenis_kelamin}
                    />
                    <DetailField label="Tempat lahir" value={detailQuery.data.profile.tempat_lahir} />
                    <DetailField
                      label="Tanggal lahir"
                      value={detailQuery.data.profile.tanggal_lahir}
                    />
                  </dl>
                </section>

                <section className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness
                      aria-hidden
                      className="text-[hsl(var(--color-primary))]"
                      size={17}
                    />
                    <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">Kepegawaian</h2>
                  </div>
                  <dl className="mt-4">
                    <DetailField label="NIP" value={detailQuery.data.employment.nip} />
                    <DetailField label="NIDN" value={detailQuery.data.employment.nidn} />
                    <DetailField label="NUPTK" value={detailQuery.data.employment.nuptk} />
                    <DetailField label="Sumber gaji" value={detailQuery.data.employment.sumber_gaji} />
                    <DetailField label="SK CPNS" value={detailQuery.data.employment.sk_cpns} />
                  </dl>
                </section>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[hsl(var(--color-primary))]/20 bg-[hsl(var(--color-primary-soft))] p-4 text-xs leading-5 text-[hsl(var(--color-primary-strong))]">
                <CircleAlert aria-hidden className="mt-0.5 shrink-0" size={15} />
                <p>
                  Data ini hanya contoh sintetis selama fixture mode. Pada mode
                  live, akses detail wajib melalui session dan permission server.
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

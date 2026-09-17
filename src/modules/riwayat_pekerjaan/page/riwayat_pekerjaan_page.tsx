import { Sidebar } from "@/component/ui/sidebar";

import { RiwayatPekerjaanWorkspaceWidget } from "../widget/riwayat_pekerjaan_workspace_widget";

export function RiwayatPekerjaanPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar activeLabel="Riwayat Pekerjaan" />
      <main className="min-w-0 flex-1 bg-[hsl(var(--color-canvas))]">
        <div className="mx-auto max-w-[1180px] space-y-6 p-5 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--color-primary))]">
              Profil SDM
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[hsl(var(--color-text))]">
              Riwayat Pekerjaan
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--color-muted))]">
              Membaca daftar riwayat pekerjaan dari SISTER berdasarkan SDM yang dipilih.
              Slice ini hanya membuka GET list dan GET detail dari dokumen API.
            </p>
          </div>
          <RiwayatPekerjaanWorkspaceWidget />
        </div>
      </main>
    </div>
  );
}

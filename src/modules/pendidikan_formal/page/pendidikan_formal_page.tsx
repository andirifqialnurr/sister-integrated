import Link from "next/link";

import { ArrowLeft, GraduationCap } from "lucide-react";

import { Sidebar } from "@/component/ui/sidebar";

import { PendidikanFormalWorkspaceWidget } from "../widget/pendidikan_formal_workspace_widget";

export function PendidikanFormalPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar activeLabel="Pendidikan Formal" />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--color-border))] bg-white px-5 sm:px-8">
          <Link
            className="inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--color-muted))] transition-colors hover:text-[hsl(var(--color-primary))]"
            href="/"
          >
            <ArrowLeft aria-hidden size={15} />
            Kembali ke ikhtisar
          </Link>
          <span className="text-xs font-medium text-[hsl(var(--color-muted))]">
            SISTER Console / Pendidikan Formal
          </span>
        </header>

        <main className="mx-auto max-w-[1440px] space-y-6 p-5 sm:p-8">
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
                <GraduationCap aria-hidden size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--color-primary))]">
                  Modul read-only
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--color-text))]">
                  Pendidikan Formal
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[hsl(var(--color-muted))]">
              Lihat riwayat pendidikan formal SDM dari endpoint SISTER yang
              terdokumentasi. Tidak ada aksi create, edit, delete, atau ajuan pada slice ini.
            </p>
          </section>

          <PendidikanFormalWorkspaceWidget />
        </main>
      </div>
    </div>
  );
}

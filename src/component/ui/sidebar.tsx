import Link from "next/link";
import {
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

type NavigationItem = {
  label: string;
  href: "/" | "/pegawai" | "#referensi" | "#pengajuan" | "#dokumen" | "#audit";
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  { label: "Ikhtisar", href: "/", icon: LayoutDashboard },
  { label: "Pegawai", href: "/pegawai", icon: UsersRound },
  { label: "Referensi", href: "#referensi", icon: ClipboardCheck },
  { label: "Pengajuan", href: "#pengajuan", icon: FileText },
  { label: "Audit security", href: "#audit", icon: ShieldCheck },
];

export function Sidebar({ activeLabel = "Ikhtisar" }: { activeLabel?: string }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-[hsl(var(--color-border))] bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-[hsl(var(--color-border))] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--color-primary))] text-sm font-black text-white">
          S
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-[hsl(var(--color-text))]">
            SISTER Console
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--color-muted))]">
            PT integration
          </p>
        </div>
      </div>

      <nav aria-label="Navigasi utama" className="flex-1 space-y-1 p-3">
        <p className="mb-3 px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--color-muted))]">
          Workspace
        </p>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeLabel;

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary-strong))]"
                  : "text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-canvas))] hover:text-[hsl(var(--color-text))]",
              )}
              href={item.href}
              key={item.label}
            >
              <Icon aria-hidden size={17} strokeWidth={isActive ? 2.4 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[hsl(var(--color-border))] p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[hsl(var(--color-muted))] transition-colors hover:bg-[hsl(var(--color-canvas))] hover:text-[hsl(var(--color-text))]">
          <Settings2 aria-hidden size={17} />
          Pengaturan
        </button>
      </div>
    </aside>
  );
}

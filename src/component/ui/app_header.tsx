import { Search } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-[hsl(var(--color-border))] bg-white px-[30px]">
      <form className="relative hidden w-full max-w-[340px] sm:block" role="search">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-muted))]"
          size={15}
        />
        <label className="sr-only" htmlFor="global-search">
          Cari
        </label>
        <input
          className="h-10 w-full rounded-lg border border-[hsl(var(--color-border))] bg-white pl-9 pr-3 text-sm text-[hsl(var(--color-text))] outline-none transition-colors placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-primary))] focus:ring-2 focus:ring-[hsl(var(--color-primary-soft))]"
          id="global-search"
          placeholder="Cari di workspace"
          type="search"
        />
      </form>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--color-primary-soft))] text-xs font-bold text-[hsl(var(--color-primary-strong))]">
        AD
      </div>
    </header>
  );
}

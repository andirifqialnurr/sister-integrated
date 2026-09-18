import { cn } from "@/lib/cn";

type DataFreshnessProps = {
  dataUpdatedAt: number;
  staleTimeMs?: number;
  className?: string;
};

function formatRelativeTime(updatedAt: number) {
  const diffSeconds = Math.max(0, Math.round((Date.now() - updatedAt) / 1000));

  if (diffSeconds < 5) return "baru saja";
  if (diffSeconds < 60) return `${diffSeconds} detik lalu`;

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.round(diffMinutes / 60);
  return `${diffHours} jam lalu`;
}

export function DataFreshness({
  className,
  dataUpdatedAt,
  staleTimeMs = 60_000,
}: DataFreshnessProps) {
  if (!dataUpdatedAt) {
    return null;
  }

  const isStale = Date.now() - dataUpdatedAt > staleTimeMs;

  return (
    <p className={cn("flex items-center gap-1.5 text-[11px] text-[hsl(var(--color-muted))]", className)}>
      {isStale && (
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--color-warning))]"
        />
      )}
      <span>
        Diperbarui {formatRelativeTime(dataUpdatedAt)}
        {isStale && " · mungkin sudah tidak terbaru"}
      </span>
    </p>
  );
}

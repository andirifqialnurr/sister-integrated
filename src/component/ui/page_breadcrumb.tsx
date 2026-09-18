import Link from "next/link";

import { ChevronRight, LayoutGrid, MoreHorizontal } from "lucide-react";

export type PageBreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbProps = {
  items: PageBreadcrumbItem[];
  detailLabel?: string;
};

export function PageBreadcrumb({ detailLabel, items }: PageBreadcrumbProps) {
  const visibleItems = detailLabel
    ? [{ label: "..." }, { label: `Detail ${detailLabel}` }]
    : items.slice(0, 2);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-2 text-sm text-[hsl(var(--color-muted))]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
        <LayoutGrid aria-hidden size={16} />
      </span>
      {visibleItems.map((item, index) => (
        <BreadcrumbSegment
          isCurrent={index === visibleItems.length - 1}
          item={item}
          key={`${item.label}-${index}`}
        />
      ))}
    </nav>
  );
}

function BreadcrumbSegment({
  isCurrent,
  item,
}: {
  isCurrent: boolean;
  item: PageBreadcrumbItem;
}) {
  return (
    <>
      <ChevronRight aria-hidden className="shrink-0 text-[hsl(var(--color-border-strong))]" size={14} />
      {item.label === "..." ? (
        <span className="flex h-8 w-8 items-center justify-center text-[hsl(var(--color-muted))]">
          <MoreHorizontal aria-hidden size={17} />
        </span>
      ) : item.href && !isCurrent ? (
        <Link
          className="truncate font-medium transition-colors hover:text-[hsl(var(--color-primary))]"
          href={item.href}
        >
          {item.label}
        </Link>
      ) : (
        <span
          aria-current={isCurrent ? "page" : undefined}
          className="truncate font-semibold text-[hsl(var(--color-text))]"
        >
          {item.label}
        </span>
      )}
    </>
  );
}

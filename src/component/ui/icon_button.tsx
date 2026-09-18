import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  label: string;
  icon: ReactNode;
  size?: "sm" | "md";
};

export function IconButton({
  className,
  icon,
  label,
  size = "md",
  title = label,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-[hsl(var(--color-muted))] transition-colors hover:bg-[hsl(var(--color-primary-soft))] hover:text-[hsl(var(--color-primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))] disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 w-8" : "h-11 w-11",
        className,
      )}
      title={title}
      type={type}
    >
      {icon}
    </button>
  );
}

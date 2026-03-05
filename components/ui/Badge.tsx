import { cn } from "@/lib/utils/cn";

type BadgeVariant =
  | "default"
  | "outline"
  | "muted"
  | "accent"
  | "success"
  | "warning"
  | "label";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-bg-card-hover)] text-fg-secondary",
  outline: "bg-transparent border border-[var(--color-border-secondary)] text-fg-muted",
  muted: "bg-[var(--color-bg-card)] text-fg-tertiary",
  accent:
    "bg-[var(--color-accent-dim)] text-accent border border-[var(--color-border-accent)]",
  success:
    "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30",
  warning:
    "bg-amber-400/10 text-amber-400 border border-amber-400/30",
  label:
    "bg-[var(--color-accent-dim)] text-accent border border-[var(--color-border-accent)] uppercase tracking-[0.15em] text-[10px]",
} as const;

export default function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide select-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

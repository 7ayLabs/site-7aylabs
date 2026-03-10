import { cn } from "@/lib/utils/cn";

type BadgeVariant =
  | "default"
  | "outline"
  | "muted"
  | "accent"
  | "success"
  | "warning"
  | "label"
  | "violet"
  | "glass";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--glass-bg)] text-fg-secondary backdrop-blur-sm",
  outline:
    "bg-transparent border border-[var(--glass-border-hover)] text-fg-muted backdrop-blur-sm",
  muted: "bg-[var(--glass-bg)] text-fg-tertiary backdrop-blur-sm",
  accent:
    "bg-[var(--color-accent-dim)] text-[var(--color-accent-primary)] border border-[var(--color-border-accent)] backdrop-blur-sm",
  success:
    "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 backdrop-blur-sm",
  warning:
    "bg-amber-400/10 text-amber-400 border border-amber-400/20 backdrop-blur-sm",
  label:
    "bg-[var(--color-accent-dim)] text-[var(--color-accent-primary)] border border-[var(--color-border-accent)] uppercase tracking-[0.15em] text-[10px] backdrop-blur-sm",
  violet:
    "bg-[var(--color-accent-violet-dim)] text-[var(--color-accent-tertiary)] border border-[rgba(139,92,246,0.2)] backdrop-blur-sm",
  glass: "glass-card text-fg-secondary text-xs",
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

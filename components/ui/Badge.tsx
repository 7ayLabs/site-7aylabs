import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "outline" | "muted" | "accent";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-white/80",
  outline: "bg-transparent border border-white/20 text-white/70",
  muted: "bg-white/5 text-white/50",
  accent:
    "bg-[rgba(120,255,180,0.14)] text-[var(--color-accent-tertiary)] border border-[var(--color-border-accent)]",
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

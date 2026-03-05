import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "outline" | "muted" | "accent" | "success" | "warning";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-white/80",
  outline: "bg-transparent border border-white/20 text-white/70",
  muted: "bg-white/5 text-white/50",
  accent: "bg-accent/10 text-accent-secondary border border-accent/20",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
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

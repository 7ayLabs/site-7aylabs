import { cn } from "@/lib/utils/cn";

interface MetricCellProps {
  /** Display value, e.g. "10,000", "v0.8.26", "<1s". */
  value: string;
  /** Caption below the value. */
  label: string;
  /** Visual weight. `xl` for hero stat band, `md` for inline strips. */
  size?: "md" | "xl";
  /** Hairline divider on the left edge — useful for inline strips. */
  divider?: boolean;
  className?: string;
}

/**
 * Single stat cell — large display value over a small uppercase label.
 *
 * Used in:
 *  - Hero inline mini-stat strip (`size="md"`)
 *  - StatsBand section row (`size="xl"`)
 */
export default function MetricCell({
  value,
  label,
  size = "md",
  divider = false,
  className,
}: MetricCellProps) {
  const valueClasses =
    size === "xl"
      ? "text-3xl md:text-5xl lg:text-6xl"
      : "text-xl md:text-2xl";

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        divider && "pl-4 sm:pl-6 border-l border-[var(--color-border-primary)]",
        className
      )}
    >
      <span
        className={cn(
          "font-display font-bold tracking-tight text-fg leading-none",
          valueClasses
        )}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] sm:text-xs tracking-[0.18em] uppercase text-fg-muted">
        {label}
      </span>
    </div>
  );
}

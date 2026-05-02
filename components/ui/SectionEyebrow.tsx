import { cn } from "@/lib/utils/cn";

interface SectionEyebrowProps {
  children: React.ReactNode;
  /** Render with a pulsing dot prefix — used for live-status eyebrows. */
  withDot?: boolean;
  /** Color of the dot (defaults to phosphor accent). */
  dotColor?: string;
  className?: string;
}

/**
 * Small, monospace, uppercase tag that anchors a section. Optional pulsing
 * dot for "live" indicators (e.g. "Devnet · Live").
 */
export default function SectionEyebrow({
  children,
  withDot = false,
  dotColor = "var(--color-accent-secondary)",
  className,
}: SectionEyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        "font-mono text-[11px] sm:text-xs tracking-[0.22em] uppercase",
        "text-fg-muted",
        className
      )}
    >
      {withDot && (
        <span
          aria-hidden="true"
          className="relative inline-flex h-1.5 w-1.5"
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: dotColor,
              boxShadow: `0 0 8px ${dotColor}`,
            }}
          />
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: dotColor, opacity: 0.6 }}
          />
        </span>
      )}
      {children}
    </span>
  );
}

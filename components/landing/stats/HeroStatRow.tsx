import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface HeroStatRowProps {
  /** Visual marker — 28×28 SVG glyph rendered at the row's accent color. */
  graphic: ReactNode;
  value: string;
  label: string;
  /** CSS color used by the graphic + the small accent bar on the left. */
  accent: string;
  className?: string;
}

/**
 * Single row inside the Hero stats card.
 *
 * Layout: [graphic 36px] [hairline accent] [value + label]. The accent bar
 * is short and sits between the graphic and the text — it's the subtle
 * "this card has a personality" cue that distinguishes one row from the next.
 */
export default function HeroStatRow({
  graphic,
  value,
  label,
  accent,
  className,
}: HeroStatRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-7 py-4",
        "transition-colors duration-200",
        "hover:bg-[var(--color-bg-card-hover)]",
        className
      )}
    >
      {/* Icon block */}
      <div
        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg"
        style={{
          background: `${accent}1A`,
          color: accent,
        }}
      >
        {graphic}
      </div>

      {/* Value + label */}
      <div className="flex-1 min-w-0">
        <span
          className="block font-display font-bold text-[28px] leading-none tracking-tight text-fg"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </span>
        <span className="mt-1.5 block font-mono text-[10px] tracking-[0.16em] uppercase text-fg-muted">
          {label}
        </span>
      </div>
    </div>
  );
}

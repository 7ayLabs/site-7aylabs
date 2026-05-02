import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface StatTileProps {
  /** Top illustration — typically a 56-72px SVG glyph from `StatGraphic`. */
  graphic: ReactNode;
  value: string;
  label: string;
  /** CSS color used by the top accent bar + hover gradient. */
  accent: string;
  /** Optional small caption above the value, e.g. "Live" / "Stable". */
  caption?: string;
  className?: string;
}

/**
 * Feature-card stat tile for the StatsBand section.
 *
 * Each tile is a standalone glassmorphism card with:
 *   - top hairline accent that grows on hover (0.5s ease)
 *   - top illustration (color-tinted by `accent`)
 *   - optional small caption above the value
 *   - large display value
 *   - mono uppercase label
 *   - subtle radial-gradient hover state in the accent color
 *
 * The four tiles in StatsBand each pass a different graphic + accent so the
 * visual rhythm reads as four related-but-distinct objects, not a uniform
 * list of numbers.
 */
export default function StatTile({
  graphic,
  value,
  label,
  accent,
  caption,
  className,
}: StatTileProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "p-7 sm:p-8",
        "transition-all duration-300",
        className
      )}
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
      }}
    >
      {/* Top accent line — animates wider on hover */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-px transition-all duration-500"
        style={{
          width: "32%",
          background: accent,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />

      {/* Hover-only ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(420px 220px at 0% 0%, ${accent}1F, transparent 70%)`,
        }}
      />

      {/* Top illustration block — fixed height keeps tiles aligned */}
      <div className="relative h-14 sm:h-16 flex items-start" style={{ color: accent }}>
        {graphic}
      </div>

      {/* Caption (optional) */}
      {caption && (
        <span className="relative mt-6 block font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted">
          {caption}
        </span>
      )}

      {/* Big value */}
      <div
        className={cn(
          "relative font-display font-bold text-fg leading-none tracking-tight",
          "text-[44px] sm:text-[52px] lg:text-[60px]",
          caption ? "mt-2" : "mt-6"
        )}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>

      {/* Label */}
      <span className="relative mt-3 block font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-fg-muted">
        {label}
      </span>
    </article>
  );
}

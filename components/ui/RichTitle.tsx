import { createElement, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface RichTitleProps {
  /** Pre-rendered children — typically the result of `t.rich(key, RICH_FORMATTERS)`. */
  children: ReactNode;
  className?: string;
  /** HTML tag to render. Defaults to `h2`. Use `h1` for hero. */
  as?: ElementType;
  id?: string;
}

/**
 * Formatters passed to `next-intl`'s `t.rich()` so message strings can include
 * `<em>` (italic-emphasis) and `<br/>` (line break) tokens that get rendered
 * as real React elements.
 *
 * Visual styling for the `em` element is in `styles/globals.css` under
 * `.rich-title em`: Instrument Serif italic + accent-color gradient,
 * contrasting against the sans-serif Syne body of the title.
 */
export const RICH_FORMATTERS = {
  em: (chunks: ReactNode) => <em>{chunks}</em>,
  br: () => <br />,
} as const;

/**
 * Heading wrapper that applies the `.rich-title` class — used by every
 * Monad-style section heading. Pair with `t.rich(key, RICH_FORMATTERS)`
 * to get serif-italic emphasis on `<em>` words.
 *
 * @example
 *   <RichTitle as="h1" id="hero-title" className="text-fg text-7xl">
 *     {t.rich("titleHtml", RICH_FORMATTERS)}
 *   </RichTitle>
 */
export default function RichTitle({
  children,
  className,
  as = "h2",
  id,
}: RichTitleProps) {
  // createElement avoids the polymorphic-JSX-typing pitfall where TS narrows
  // the union of valid props to `never`.
  return createElement(
    as,
    { id, className: cn("rich-title", className) },
    children
  );
}

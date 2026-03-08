import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant =
  | "default"
  | "elevated"
  | "outline"
  | "interactive"
  | "glass"
  | "link"
  | "feature"
  | "bento";
type CardPadding = "none" | "sm" | "md" | "lg" | "xl";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

const variantStyles: Record<CardVariant, string> = {
  default: "glass-card",
  elevated: "glass-card shadow-lg",
  outline:
    "bg-transparent border border-[var(--glass-border-hover)] rounded-2xl",
  interactive:
    "glass-card hover:shadow-glow-sm cursor-pointer group transition-all duration-300",
  glass: "glass-card",
  link: "glass-card hover:shadow-glow-sm group transition-all duration-300",
  feature:
    "glass-card overflow-hidden hover:shadow-glow-sm transition-all duration-300",
  bento:
    "glass-card overflow-hidden hover:shadow-glow-sm transition-all duration-300",
} as const;

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6 md:p-8",
  lg: "px-8 py-10",
  xl: "p-10",
} as const;

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

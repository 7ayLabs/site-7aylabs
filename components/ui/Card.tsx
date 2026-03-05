import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant =
  | "default"
  | "elevated"
  | "outline"
  | "interactive"
  | "glass"
  | "link"
  | "feature";
type CardPadding = "none" | "sm" | "md" | "lg" | "xl";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white/5 border border-white/10 rounded-2xl",
  elevated:
    "bg-white/5 border border-white/10 rounded-2xl backdrop-blur",
  outline:
    "bg-transparent border border-white/20 rounded-2xl",
  interactive:
    "bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-normal cursor-pointer group",
  glass: "glass rounded-2xl",
  link: "bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-normal group",
  feature:
    "bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-normal",
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

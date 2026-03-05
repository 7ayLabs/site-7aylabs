import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "default" | "elevated" | "outline" | "interactive" | "glass";
type CardPadding = "none" | "sm" | "md" | "lg" | "xl";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white/[0.02] border border-white/[0.08] rounded-2xl",
  elevated:
    "bg-white/[0.03] border border-white/[0.08] rounded-2xl shadow-lg",
  outline:
    "bg-transparent border border-white/[0.12] rounded-2xl",
  interactive:
    "bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-normal cursor-pointer group",
  glass:
    "glass rounded-2xl",
} as const;

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
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

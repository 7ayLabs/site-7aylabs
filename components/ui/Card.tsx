import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "default" | "elevated" | "outline";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white/[0.04] border border-white/10",
  elevated: "bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-lg",
  outline: "bg-transparent border border-white/[0.15]",
} as const;

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6 md:p-8",
  lg: "px-8 py-10",
} as const;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-colors duration-normal",
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

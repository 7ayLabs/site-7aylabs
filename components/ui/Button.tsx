"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center font-semibold tracking-tight transition-colors duration-200 select-none",
  {
    variants: {
      variant: {
        // Primary — solid black (or white in dark theme), text-on-bg inversion
        primary:
          "bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-primary)] hover:text-white",
        // Secondary — outline only, fills with ink on hover
        secondary:
          "border border-[var(--color-border-secondary)] text-fg hover:bg-[var(--color-fg-primary)] hover:text-[var(--color-bg-primary)] hover:border-[var(--color-fg-primary)]",
        // Ghost — no chrome at rest, subtle hover
        ghost:
          "text-fg-secondary hover:text-fg hover:bg-[var(--color-bg-card-hover)]",
        // Glass kept for back-compat — rendered as ghost
        glass:
          "text-fg-secondary hover:text-fg hover:bg-[var(--color-bg-card-hover)]",
      },
      size: {
        sm: "text-sm px-5 h-9 gap-2 rounded-[2px]",
        md: "text-sm px-6 h-11 gap-2.5 rounded-[2px]",
        lg: "text-[15px] px-7 h-12 gap-3 rounded-[2px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  external?: boolean;
  withArrow?: boolean;
}

const ArrowIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-normal group-hover:translate-x-0.5"
    aria-hidden="true"
  >
    <path d="M1 7h12M8 2l5 5-5 5" />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, href, external, withArrow, children, ...props },
    ref
  ) => {
    const classes = cn(
      buttonVariants({ variant, size }),
      withArrow && "group",
      /* CSS-only hover scale for links; Framer Motion only on <button> */
      href && "hover:scale-[1.03] active:scale-[0.97]",
      className
    );

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
          {withArrow && <ArrowIcon />}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {children}
        {withArrow && <ArrowIcon />}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;

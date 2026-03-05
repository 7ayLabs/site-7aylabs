import { forwardRef } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-normal rounded-full select-none",
  {
    variants: {
      variant: {
        primary: "bg-accent text-black hover:bg-accent-secondary",
        secondary:
          "border border-[var(--color-border-secondary)] text-fg-secondary hover:border-[var(--color-border-hover)] hover:text-fg",
        ghost:
          "text-fg-secondary hover:text-fg hover:bg-[var(--color-bg-card-hover)]",
      },
      size: {
        sm: "text-sm px-5 py-2 gap-2",
        md: "text-sm px-7 py-3 gap-2.5",
        lg: "text-base px-8 py-3.5 gap-3",
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
      <button ref={ref} className={classes} {...props}>
        {children}
        {withArrow && <ArrowIcon />}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

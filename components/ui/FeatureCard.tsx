import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

interface FeatureCardProps {
  title: string;
  description: string;
  illustration?: React.ReactNode;
  illustrationBg?: string;
  cta?: { label: string; href: string };
  size?: "lg" | "md" | "sm";
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  illustration,
  illustrationBg = "bg-bg-tertiary",
  cta,
  size = "md",
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group glass-card overflow-hidden glow-border",
        className
      )}
    >
      {illustration && (
        <div
          className={cn(
            "flex items-center justify-center overflow-hidden",
            illustrationBg,
            size === "lg"
              ? "h-64 md:h-80"
              : size === "md"
                ? "h-48 md:h-56"
                : "h-40 md:h-48"
          )}
        >
          {illustration}
        </div>
      )}
      <div className={cn("p-6", size === "lg" && "p-8")}>
        <h3
          className={cn(
            "font-display font-semibold text-fg mb-2",
            size === "lg" ? "text-xl md:text-2xl" : "text-lg"
          )}
        >
          {title}
        </h3>
        <p className="text-fg-tertiary text-sm leading-relaxed">
          {description}
        </p>
        {cta && (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-accent hover:text-accent-secondary transition-colors duration-fast group/link"
          >
            {cta.label}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="group-hover/link:translate-x-0.5 transition-transform duration-fast"
              aria-hidden="true"
            >
              <path d="M2 6h8M7 3l3 3-3 3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

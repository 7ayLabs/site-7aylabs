import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LinkCardProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  description?: string;
  className?: string;
}

export default function LinkCard({
  icon,
  title,
  href,
  description,
  className,
}: LinkCardProps) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group flex items-start gap-4 p-5 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)]",
        "hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-secondary)] transition-all duration-normal",
        className
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-dim)] flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/20 transition-colors duration-normal">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-fg text-sm">{title}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-fg-faint group-hover:text-fg-muted group-hover:translate-x-0.5 transition-all duration-normal"
            aria-hidden="true"
          >
            <path d="M2 6h8M7 3l3 3-3 3" />
          </svg>
        </div>
        {description && (
          <p className="mt-1 text-xs text-fg-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

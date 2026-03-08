import { cn } from "@/lib/utils/cn";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({
  children,
  className,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold uppercase tracking-[0.15em] text-accent px-3 py-1 rounded-full border border-[var(--color-border-accent)] bg-[var(--color-accent-dim)] backdrop-blur-sm",
        className
      )}
    >
      {children}
    </span>
  );
}

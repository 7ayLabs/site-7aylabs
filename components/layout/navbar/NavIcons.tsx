/**
 * Custom nav icons — designed for 7aychain's identity.
 * 20×20 viewBox, currentColor, stroke-based, rounded caps.
 * Drop-in replacements for Lucide icons (same props interface).
 */

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/* ── Technology: Hexagonal chip with inner node constellation ── */
export function IconTechnology({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M10 1.5L17.5 5.75V14.25L10 18.5L2.5 14.25V5.75L10 1.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Inner node triangle */}
      <circle cx="10" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="7" cy="12.5" r="1.2" fill="currentColor" />
      <circle cx="13" cy="12.5" r="1.2" fill="currentColor" />
      <path
        d="M10 6.5L7 12.5M10 6.5L13 12.5M7 12.5H13"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.65}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Why Presence: Person with proximity signal arcs ── */
export function IconPresence({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Person */}
      <circle cx="6.5" cy="7" r="2.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M2 16.5C2 13.5 4 12 6.5 12C7.8 12 8.5 12.3 9 12.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Proximity arcs */}
      <path
        d="M12.5 7.5C13.8 8.8 13.8 11.2 12.5 12.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M15 5.5C17.2 7.7 17.2 12.3 15 14.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Glossary: Open book with page lines ── */
export function IconGlossary({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Book spine */}
      <path
        d="M10 4V17"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Left page */}
      <path
        d="M10 4C8 3 4.5 2.5 2 3.5V16.5C4.5 15.5 8 16 10 17"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right page */}
      <path
        d="M10 4C12 3 15.5 2.5 18 3.5V16.5C15.5 15.5 12 16 10 17"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Text lines on left page */}
      <path
        d="M4.5 7H7.5M4.5 9.5H7"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.65}
        strokeLinecap="round"
      />
      {/* Text lines on right page */}
      <path
        d="M12.5 7H15.5M13 9.5H15.5"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.65}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Devnet: Terminal window with blinking prompt ── */
export function IconDevnet({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Window frame */}
      <rect
        x="2"
        y="3"
        width="16"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Title bar dots */}
      <circle cx="5" cy="6" r="0.7" fill="currentColor" />
      <circle cx="7.2" cy="6" r="0.7" fill="currentColor" />
      <circle cx="9.4" cy="6" r="0.7" fill="currentColor" />
      {/* Terminal prompt chevron */}
      <path
        d="M5.5 10.5L8 12.5L5.5 14.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cursor line */}
      <path
        d="M10 14.5H14"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Validators: Diamond badge with checkmark ── */
export function IconValidators({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Shield / badge shape */}
      <path
        d="M10 2L16.5 5.5V10.5C16.5 14 13.5 16.8 10 18C6.5 16.8 3.5 14 3.5 10.5V5.5L10 2Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Checkmark */}
      <path
        d="M7 10.5L9 12.5L13 8"
        stroke="currentColor"
        strokeWidth={strokeWidth * 1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Ecosystem: Three interconnected nodes forming a network ── */
export function IconEcosystem({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Connection lines */}
      <path
        d="M10 4L5 14M10 4L15 14M5 14H15"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.65}
      />
      {/* Node circles */}
      <circle
        cx="10"
        cy="4"
        r="2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="5"
        cy="14"
        r="2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="15"
        cy="14"
        r="2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Inner dots */}
      <circle cx="10" cy="4" r="1" fill="currentColor" />
      <circle cx="5" cy="14" r="1" fill="currentColor" />
      <circle cx="15" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

/* ── Updates: Notification bell with pulse ring ── */
export function IconUpdates({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Bell body */}
      <path
        d="M10 2.5C10 2.5 5 4.5 5 10V13.5L3.5 15.5H16.5L15 13.5V10C15 4.5 10 2.5 10 2.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Clapper */}
      <path
        d="M8 15.5C8 16.6 8.9 17.5 10 17.5C11.1 17.5 12 16.6 12 15.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Notification dot */}
      <circle cx="14.5" cy="5" r="2" fill="currentColor" />
    </svg>
  );
}

/* ── Use Cases: Stacked layers / cards ── */
export function IconUseCases({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Back card */}
      <rect
        x="4"
        y="2"
        width="12"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={0.4}
      />
      {/* Middle card */}
      <rect
        x="3"
        y="5"
        width="12"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={0.6}
      />
      {/* Front card */}
      <rect
        x="5"
        y="8"
        width="12"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Lines on front card */}
      <path
        d="M8 12H14M8 14.5H12"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.65}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Waitlist: Person outline with clock/timer ── */
export function IconWaitlist({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Person */}
      <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M2.5 17.5C2.5 14 5 12 8 12C9.2 12 10.2 12.3 11 12.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Clock */}
      <circle cx="15" cy="14" r="3.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M15 12V14.2L16.5 15.2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Newsletter: Paper airplane / send ── */
export function IconNewsletter({
  size = 18,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Paper airplane */}
      <path
        d="M2.5 10L17.5 3L14 17.5L10.5 11.5L2.5 10Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Fold line */}
      <path
        d="M10.5 11.5L17.5 3"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.65}
        strokeLinecap="round"
      />
      {/* Trail */}
      <path
        d="M10.5 11.5V16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── GitHub: Keep Lucide's for brand consistency ── */
export { Github as IconGithub } from "lucide-react";

/* ── External link arrow ── */
export { ArrowRight as IconExternal } from "lucide-react";

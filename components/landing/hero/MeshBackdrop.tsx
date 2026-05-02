/**
 * Hero backdrop.
 *
 * The earlier mesh-gradient + grid texture has been removed in favor of
 * the editorial DePIN register: a clean surface, hairline-only divider
 * at the section boundary. Page background comes from `--color-bg-primary`
 * on `body`. This component now exists purely as a structural placeholder
 * + bottom hairline — kept so the Hero's existing markup doesn't break.
 */
export default function MeshBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-px -z-10 pointer-events-none"
      style={{ background: "var(--color-border-primary)" }}
    />
  );
}

/** A check that draws itself in as its list scrolls into view (`.l-tick`). */
export function Tick() {
  return (
    <span className="l-tick" aria-hidden>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6.4 5 8.7l4.5-5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      </svg>
    </span>
  );
}

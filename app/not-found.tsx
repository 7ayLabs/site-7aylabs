import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen items-center justify-center bg-bg overflow-hidden"
    >
      {/* Decorative gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 50% 40%, rgba(20,184,166,0.08), transparent 70%)",
        }}
      />

      <div className="relative text-center px-6">
        <h1 className="text-8xl sm:text-9xl font-bold gradient-text select-none">
          404
        </h1>
        <p className="mt-4 text-lg text-fg-tertiary">
          This page could not be found.
        </p>
        <p className="mt-2 text-sm text-fg-faint">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="relative overflow-hidden inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full select-none bg-[var(--color-accent-primary)] text-white hover:shadow-glow-sm hover:brightness-110 active:scale-[0.97] text-base px-8 py-3.5 gap-3 hover:scale-[1.03]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

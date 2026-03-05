import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen items-center justify-center bg-dark overflow-hidden"
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
        <p className="mt-4 text-lg text-white/55">
          This page could not be found.
        </p>
        <p className="mt-2 text-sm text-white/35">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-full px-8 py-3.5 min-h-[48px] bg-accent text-black font-semibold text-sm hover:bg-accent-secondary transition-colors duration-normal"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

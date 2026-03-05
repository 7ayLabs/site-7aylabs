import Link from "next/link";
import "./errors/errors.module.css";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-dark"
    >
      <div className="text-center px-6">
        <h1 className="text-6xl sm:text-7xl font-bold text-white">404</h1>
        <p className="mt-4 text-lg text-white/60">
          This page could not be found.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full px-8 py-3 min-h-[44px] bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors duration-normal"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

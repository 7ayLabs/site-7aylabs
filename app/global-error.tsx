"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] text-fg font-sans">
        <div className="text-center px-6">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-fg-secondary mb-6">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="bg-accent text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent-secondary transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

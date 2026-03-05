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
      <body className="min-h-screen flex items-center justify-center bg-[#060606] text-white font-sans">
        <div className="text-center px-6">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-white/60 mb-6">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="bg-[#14b8a6] text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#00ffc6] transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

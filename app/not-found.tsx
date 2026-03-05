import "./errors/errors.module.css";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dark">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="mt-4 text-lg text-white/60">
          This page could not be found.
        </p>
      </div>
    </main>
  );
}

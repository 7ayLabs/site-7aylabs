import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Public-pages layout.
 *
 * The previous implementation mounted a global `BackgroundWithVariant` that
 * rendered a pixelated canvas-based starfield/nebula on every page. That has
 * been removed — each section is responsible for its own background (e.g. the
 * Hero's `MeshBackdrop`) so the rest of the page reads as a clean, minimal
 * surface that lets typography do the work.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-10">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}

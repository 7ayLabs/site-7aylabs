import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/providers/PageTransition";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Single radial glow — subtle ambient light source */}
      <div className="ambient-glow" aria-hidden="true" />
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

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import NebulaBackground from "@/components/background/NebulaBackground";
import PageTransition from "@/components/providers/PageTransition";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NebulaBackground />
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

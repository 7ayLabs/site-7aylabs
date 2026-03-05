import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import AmbientBackground from "@/components/background/AmbientBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main id="main-content" className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}

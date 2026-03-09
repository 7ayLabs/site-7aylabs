import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import AmbientBackground from "@/components/background/AmbientBackground";
import NetworkUniverse from "@/components/background/NetworkUniverse";
import { AmbientColorProvider } from "@/components/providers/AmbientColorProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AmbientColorProvider>
      <AmbientBackground />
      <NetworkUniverse />
      <Navbar />
      <main id="main-content" className="relative z-10">
        {children}
      </main>
      <Footer />
    </AmbientColorProvider>
  );
}

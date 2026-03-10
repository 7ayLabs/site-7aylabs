import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundWithVariant from "@/components/background/BackgroundWithVariant";
import { AmbientColorProvider } from "@/components/providers/AmbientColorProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AmbientColorProvider>
      <BackgroundWithVariant />
      <Navbar />
      <main id="main-content" className="relative z-10">
        {children}
      </main>
      <Footer />
    </AmbientColorProvider>
  );
}

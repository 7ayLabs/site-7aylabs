import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/navbar/Navbar";
import AmbientBackground from "@/components/background/AmbientBackground";
import NetworkUniverse from "@/components/background/NetworkUniverse";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/layout/Footer";
import { AmbientColorProvider } from "@/components/providers/AmbientColorProvider";

/* Lazy-load below-the-fold sections to reduce initial hydration burst */
const WhyChain = dynamic(
  () => import("@/components/landing/Projects"),
);
const Newsletter = dynamic(
  () => import("@/components/landing/Newsletter"),
);

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AmbientColorProvider>
      <AmbientBackground />
      <NetworkUniverse />
      <Navbar />
      <main id="main-content" className="relative z-10">
        <Hero />
        <HowItWorks />
        <WhyChain />
        <Newsletter />
      </main>
      <Footer />
    </AmbientColorProvider>
  );
}

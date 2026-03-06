import dynamic from "next/dynamic";
import Navbar from "@/components/layout/navbar/Navbar";
import AmbientBackground from "@/components/background/AmbientBackground";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/layout/Footer";

/* Lazy-load below-the-fold sections to reduce initial hydration burst */
const KeyFeatures = dynamic(
  () => import("@/components/landing/ProtocolArchitecture"),
);
const ComparisonTable = dynamic(
  () => import("@/components/landing/ComparisonTable"),
);
const UseCases = dynamic(
  () => import("@/components/landing/UseCases"),
);
const DevnetStatus = dynamic(
  () => import("@/components/landing/DevnetStatus"),
);
const WhyChain = dynamic(
  () => import("@/components/landing/Projects"),
);
const Newsletter = dynamic(
  () => import("@/components/landing/Newsletter"),
);

export default function Home() {
  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main id="main-content">
        <Hero />
        <KeyFeatures />
        <HowItWorks />
        <ComparisonTable />
        <UseCases />
        <DevnetStatus />
        <WhyChain />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

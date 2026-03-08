import dynamic from "next/dynamic";
import Navbar from "@/components/layout/navbar/Navbar";
import AmbientBackground from "@/components/background/AmbientBackground";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/layout/Footer";

/* Lazy-load below-the-fold sections to reduce initial hydration burst */
const WhyChain = dynamic(
  () => import("@/components/landing/Projects"),
);
const ComparisonTable = dynamic(
  () => import("@/components/landing/ComparisonTable"),
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
        <HowItWorks />
        <WhyChain />
        <ComparisonTable />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

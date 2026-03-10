import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";

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
    <>
      <Hero />
      <HowItWorks />
      <WhyChain />
      <Newsletter />
    </>
  );
}

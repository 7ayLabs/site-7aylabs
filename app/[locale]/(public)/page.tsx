import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/landing/Hero";
import StatsBand from "@/components/landing/StatsBand";
import HowItWorks from "@/components/landing/HowItWorks";

/* Below-the-fold sections — dynamic-imported to keep initial JS lean. */
const WhyChain = dynamic(() => import("@/components/landing/Projects"));
const UseCasesPreview = dynamic(
  () => import("@/components/landing/UseCasesPreview")
);
const Newsletter = dynamic(() => import("@/components/landing/Newsletter"));

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <StatsBand />
      <HowItWorks />
      <WhyChain />
      <UseCasesPreview />
      <Newsletter />
    </>
  );
}

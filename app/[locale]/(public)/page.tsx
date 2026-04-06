import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/landing/Hero";

/* Lazy-load below-the-fold sections to reduce initial hydration burst */
const About = dynamic(() => import("@/components/landing/About"));
const Features = dynamic(() => import("@/components/landing/Projects"));
const Network = dynamic(() => import("@/components/landing/Network"));
const Ecosystem = dynamic(() => import("@/components/landing/Ecosystem"));
const TechStack = dynamic(() => import("@/components/landing/TechStack"));
const Newsletter = dynamic(() => import("@/components/landing/Newsletter"));

/*
 * Landing page — openclaw.ai inspired section order:
 * 1. Hero       — headline + subtitle + CTAs + feature cards
 * 2. About      — 3x2 grid (what 7aychain does)
 * 3. Features   — 4-col bordered grid (why 7aychain)
 * 4. Network    — stats + protocol grid
 * 5. Ecosystem  — infinite marquee use case cards
 * 6. TechStack  — pill badges (built with)
 * 7. Newsletter — final CTA
 */
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
      <About />
      <Features />
      <Network />
      <Ecosystem />
      <TechStack />
      <Newsletter />
    </>
  );
}

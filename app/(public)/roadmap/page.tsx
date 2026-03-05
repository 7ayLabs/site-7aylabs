import type { Metadata } from "next";
import Roadmap from "@/components/landing/Roadmap";
import Newsletter from "@/components/landing/Newsletter";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "7aychain protocol development roadmap — from Proof of Presence core to mainnet. Track progress across validator infrastructure, governance, vaults, and the presence economy.",
  keywords: [
    "7aychain roadmap",
    "blockchain development",
    "protocol milestones",
    "Proof of Presence progress",
  ],
};

export default function RoadmapPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Roadmap />
      </section>
      <Newsletter />
    </>
  );
}

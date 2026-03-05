import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Track real progress across 7aychain and the 7ayLabs project — protocol milestones, shipped features, and infrastructure updates.",
  keywords: ["7aychain updates", "protocol changelog", "blockchain development progress", "7ayLabs releases"],
};

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

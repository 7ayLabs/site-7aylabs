import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waitlist",
  description:
    "Get early access to 7aychain and Proof of Presence — private access for teams testing real-world presence in production.",
  keywords: ["7aychain waitlist", "early access blockchain", "Proof of Presence beta", "validator early access"],
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

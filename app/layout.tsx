import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "7ayLabs",
    template: "%s | 7ayLabs",
  },
  description:
    "7ayLabs builds 7aychain, a Layer 1 blockchain with on-chain Proof of Presence. Validators triangulate physical presence through network latency — no GPS, no oracles, no special hardware. Powered by $7AY.",
  keywords: [
    "7ayLabs",
    "7aychain",
    "Proof of Presence",
    "PoP protocol",
    "presence layer",
    "Layer 1 blockchain",
    "Web3 infrastructure",
    "blockchain verification",
    "$7AY token",
    "on-chain presence",
    "witness circles",
    "network latency triangulation",
    "Substrate",
    "presence economy",
  ],
  metadataBase: new URL("https://7aylabs.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "7ayLabs — 7aychain: Layer 1 Blockchain with Proof of Presence",
    description:
      "7aychain is a Layer 1 blockchain where validators form witness circles and triangulate physical presence through network latency. No GPS, no oracles. Powered by $7AY.",
    url: "https://7aylabs.com",
    siteName: "7ayLabs",
    images: [
      {
        url: "/og/7aylabs-og.png",
        width: 1200,
        height: 630,
        alt: "7ayLabs — 7aychain Proof of Presence Layer 1 Blockchain",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "7ayLabs — 7aychain: Proof of Presence Layer 1",
    description:
      "7aychain: a Layer 1 blockchain where validators triangulate physical presence through network latency. No GPS, no oracles. Built on Substrate. Powered by $7AY.",
    images: ["/og/7aylabs-og.png"],
    creator: "@7aylabs",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "technology",
  applicationName: "7ayLabs",
  creator: "7ayLabs",
  publisher: "7ayLabs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen text-white antialiased selection:bg-white/10 selection:text-white bg-[linear-gradient(180deg,#0b0d12_0%,#0e1118_40%,#0a0c11_70%,#07090d_100%)]">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

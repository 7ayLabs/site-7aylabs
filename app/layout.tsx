import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "@/styles/globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "7ayLabs",
    template: "%s | 7ayLabs",
  },
  description:
    "7aychain is a Layer 1 blockchain for Sybil-resistant human verification. Validators triangulate physical presence through network latency — no GPS, no biometrics, no hardware. The presence layer for Web3. Powered by $7AY.",
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
    "Sybil resistance",
    "proof of humanity",
    "on-chain governance",
    "decentralized identity",
    "human verification blockchain",
    "anti-bot blockchain",
    "location verification protocol",
    "DAO governance token",
    "zero knowledge presence",
    "Polkadot SDK",
    "DePIN protocol",
    "real world asset verification",
    "validator staking",
    "on-chain dispute resolution",
    "AI resistant blockchain",
  ],
  metadataBase: new URL("https://7aylabs.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "7ayLabs — 7aychain: Layer 1 Blockchain with Proof of Presence",
    description:
      "7aychain: a Layer 1 blockchain where validators triangulate physical presence through network latency. Sybil-resistant human verification — no GPS, no biometrics, no hardware. The presence layer for Web3.",
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
      "7aychain: Sybil-resistant human verification through physical presence. Validators triangulate via network latency. No GPS, no biometrics. The presence layer for Web3. Powered by $7AY.",
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
    <html
      lang="en"
      className={`scroll-smooth ${plusJakarta.variable} ${syne.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.setAttribute('data-theme',window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "7ayLabs",
                  url: "https://7aylabs.com",
                  logo: "https://7aylabs.com/7aylabs_white_logo.svg",
                  sameAs: [
                    "https://x.com/7ayLabs",
                    "https://github.com/7ayLabs",
                  ],
                },
                {
                  "@type": "WebSite",
                  name: "7ayLabs",
                  url: "https://7aylabs.com",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased bg-bg text-fg">
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

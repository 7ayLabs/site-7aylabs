import { getTranslations, setRequestLocale } from "next-intl/server";
import WaitlistContent from "./WaitlistContent";
import { buildPageAlternates, buildOpenGraph } from "@/lib/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.waitlist" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildPageAlternates("/waitlist"),
    openGraph: buildOpenGraph(t("title"), t("description"), "/waitlist"),
  };
}

export default async function WaitlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WaitlistContent />;
}

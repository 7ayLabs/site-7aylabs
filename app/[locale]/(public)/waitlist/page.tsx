import { getTranslations, setRequestLocale } from "next-intl/server";
import WaitlistContent from "./WaitlistContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.waitlist" });
  return { title: t("title"), description: t("description") };
}

export default async function WaitlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WaitlistContent />;
}

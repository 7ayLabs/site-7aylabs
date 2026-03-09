import { getTranslations, setRequestLocale } from "next-intl/server";
import UpdatesContent from "./UpdatesContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.updates" });
  return { title: t("title"), description: t("description") };
}

export default async function UpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <UpdatesContent />;
}

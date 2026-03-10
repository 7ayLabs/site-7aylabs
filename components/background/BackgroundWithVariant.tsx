"use client";

import { usePathname } from "next/navigation";
import AmbientBackground from "@/components/background/AmbientBackground";
import NetworkUniverse from "@/components/background/NetworkUniverse";
import type { BackgroundVariant } from "@/components/background/NetworkUniverse";

function getVariant(pathname: string): BackgroundVariant {
  const segments = pathname.split("/").filter(Boolean);
  const page = segments.length > 1 ? segments[segments.length - 1] : "";

  switch (page) {
    case "technology":   return "technology";
    case "why-presence": return "presence";
    case "use-cases":    return "usecases";
    case "glossary":     return "glossary";
    case "waitlist":     return "waitlist";
    case "newsletter":   return "newsletter";
    case "updates":      return "updates";
    case "devnet":       return "devnet";
    case "validators":   return "validators";
    case "ecosystem":    return "ecosystem";
    default:             return "default";
  }
}

export default function BackgroundWithVariant() {
  const pathname = usePathname();
  const variant = getVariant(pathname);

  return (
    <>
      <AmbientBackground variant={variant} />
      <NetworkUniverse variant={variant} />
    </>
  );
}

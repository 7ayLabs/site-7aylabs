import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const COUNTRY_LOCALE_MAP: Record<string, string> = {
  // Spanish-speaking
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",
  // Portuguese-speaking
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt",
  // French-speaking
  FR: "fr", BE: "fr", CH: "fr", CA: "fr", SN: "fr", CI: "fr",
  // German-speaking
  DE: "de", AT: "de",
  // Chinese-speaking
  CN: "zh", TW: "zh", HK: "zh", SG: "zh",
  // Japanese
  JP: "ja",
};

function getGeoLocale(request: NextRequest): string | undefined {
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");

  if (country) {
    return COUNTRY_LOCALE_MAP[country.toUpperCase()];
  }
  return undefined;
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const geoLocale = getGeoLocale(request);

  if (geoLocale && !request.cookies.get("NEXT_LOCALE")) {
    const acceptLang = request.headers.get("accept-language") || "";
    if (!acceptLang.includes(geoLocale)) {
      const headers = new Headers(request.headers);
      headers.set("accept-language", `${geoLocale};q=0.9, ${acceptLang}`);
      const modifiedRequest = new NextRequest(request.url, {
        headers,
        method: request.method,
      });
      return intlMiddleware(modifiedRequest);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|es|pt|fr|de|zh|ja)/:path*",
    "/((?!api|_next|_vercel|favicon|og|.*\\..*).*)",
  ],
};

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: (process.env.ALLOWED_ORIGINS || "7aylabs.com").split(","),
    },
  },
};

export default withNextIntl(nextConfig);

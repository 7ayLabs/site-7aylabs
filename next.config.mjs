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

export default nextConfig;

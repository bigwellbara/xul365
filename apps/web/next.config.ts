import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Allow imports from local packages
  transpilePackages: [
    "@xul365/domain",
    "@xul365/application",
    "@xul365/infrastructure",
    "@xul365/database",
    "@xul365/ui",
  ],

  // Image domains for school logos
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudflare.com",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
}

export default nextConfig
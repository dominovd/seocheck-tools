/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Image optimization: allow YouTube thumbnails to be proxied via Next/Image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },

  // Permanent redirects — preserve link equity from deprecated URLs.
  async redirects() {
    return [
      // Visibility Score was merged into Channel Audit (2026-06).
      // 301 permanent so search engines roll the signal over.
      {
        source: "/tools/youtube-visibility-score",
        destination: "/tools/youtube-channel-audit",
        permanent: true,
      },
    ];
  },

  // Security headers — applies to every response
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

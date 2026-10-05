import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Freestar-hosted ads.txt. Must be a 301: `permanent: true` sends a 308,
      // which isn't one of the redirect codes ads.txt crawlers are required to follow.
      {
        source: "/ads.txt",
        destination: "https://a.pub.network/commonwords-net/ads.txt",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;

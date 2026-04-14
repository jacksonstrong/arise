import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/webhooks/adhara",
        destination: "https://serafina.aurealeaders.com/api/webhooks/adhara",
      },
    ];
  },
};

export default nextConfig;

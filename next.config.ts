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
  async headers() {
    return [
      {
        source: "/arise.ics",
        headers: [
          { key: "Content-Type", value: "text/calendar; charset=utf-8" },
          { key: "Content-Disposition", value: 'attachment; filename="arise.ics"' },
        ],
      },
    ];
  },
};

export default nextConfig;

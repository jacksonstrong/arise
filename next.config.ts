import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/serafina",
        destination: "https://seraphina-gateway.vercel.app/trial",
      },
      {
        source: "/serafina/:path*",
        destination: "https://seraphina-gateway.vercel.app/trial/:path*",
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.7.53",
        port: "5010",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;

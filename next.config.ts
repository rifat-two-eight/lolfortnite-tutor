import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.7.24",
        port: "5010",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "lolfortnite.apponislam.top",
        // port: "5010",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lolfortnite.apponislam.top",
        // port: "5010",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;

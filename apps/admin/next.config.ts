import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sundrop/ui", "@sundrop/data", "@sundrop/tokens"],
  env: {
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_INVESTOR_URL: process.env.NEXT_PUBLIC_INVESTOR_URL ?? "http://localhost:3001",
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3002",
  },
};

export default nextConfig;

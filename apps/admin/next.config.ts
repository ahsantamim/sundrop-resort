import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sundrop/ui", "@sundrop/data", "@sundrop/tokens"],
  env: {
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL ?? "http://127.0.0.1:4210",
    NEXT_PUBLIC_INVESTOR_URL: process.env.NEXT_PUBLIC_INVESTOR_URL ?? "http://127.0.0.1:4211",
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://127.0.0.1:4212",
  },
};

export default nextConfig;

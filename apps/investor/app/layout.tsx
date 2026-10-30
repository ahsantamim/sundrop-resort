import type { Metadata } from "next";
import { Fraunces, Hind_Siliguri, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600"], variable: "--font-hind" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "Investor portal · SUNDROP Eco Resort", template: "%s · SUNDROP Eco Resort" },
  description: "Demo investor portal. Sample holdings and placeholder reports.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${hind.variable}`}>
      <body>{children}</body>
    </html>
  );
}

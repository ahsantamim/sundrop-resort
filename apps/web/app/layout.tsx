import { I18nProvider, type Lang } from "@sundrop/ui";
import type { Metadata } from "next";
import { Fraunces, Hind_Siliguri, Manrope } from "next/font/google";
import { cookies } from "next/headers";
import { Footer } from "@/components/chrome/footer";
import { Header } from "@/components/chrome/header";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600"], variable: "--font-hind", display: "swap" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "SUNDROP Eco Resort", template: "%s · SUNDROP Eco Resort" },
  description: "Demo of a luxury eco-resort and investor desk on Saint Martin’s Island, Cox’s Bazar. Sample rates and sample figures only.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const lang: Lang = jar.get("lang")?.value === "bn" ? "bn" : "en";
  return (
    <html lang={lang} className={`${fraunces.variable} ${manrope.variable} ${hind.variable}`} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reduce')}catch(e){}",
          }}
        />
        <I18nProvider initial={lang}>
          <MotionProvider>
            <a href="#content" style={{ position: "absolute", left: 12, top: -40 }}>
              Skip to content
            </a>
            <Header />
            <div id="content">{children}</div>
            <Footer />
          </MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

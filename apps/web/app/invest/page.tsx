import { getRepo, remainingShares } from "@sundrop/data";
import { photos } from "@sundrop/data/images";
import type { Project } from "@sundrop/data/types";
import { Button, formatBdt, formatNumber, siteUrls } from "@sundrop/ui";
import {
  ArrowRight,
  Building2,
  CircleDashed,
  FileText,
  Layers,
  LockKeyhole,
  PieChart,
  ShieldCheck,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageBanner } from "@/components/chrome/page-banner";
import { Scenery } from "@/components/chrome/scenery";
import { ProjectCard } from "@/components/invest/project-card";
import { getLang } from "@/lib/lang";

export const metadata: Metadata = { title: "Invest" };

const EXTRA_SHOWCASE_PROJECTS: Project[] = [
  {
    id: "proj-jetty",
    slug: "phase-2-lagoon-villas",
    name: "Sunset Jetty & Arrival Lounge",
    nameBn: "সানসেট জেটি ও অভ্যর্থনা লাউঞ্জ",
    eyebrow: "Marine & arrival",
    eyebrowBn: "মেরিন ও আগমন",
    location: "West shoreline, Saint Martin’s Island (demo site)",
    locationBn: "পশ্চিম তীর, সেন্ট মার্টিন দ্বীপ (ডেমো সাইট)",
    summary: "Timber arrival jetty, electric boat berths and an open-air sunset lounge.",
    summaryBn: "কাঠের আগমন জেটি, বৈদ্যুতিক নৌকার ঘাট এবং খোলা সানসেট লাউঞ্জ।",
    story: "Sample marine infrastructure card on the web investor page.",
    storyBn: "বিনিয়োগকারী পাতার নমুনা সামুদ্রিক অবকাঠামো প্রকল্প।",
    pricePerShare: 450000,
    illustrativeYield: "Sample label only — not a forecast",
    totalShares: 600,
    soldShares: 480,
    reservedShares: 48,
    completion: "Q3 2027 · sample schedule",
    completionBn: "২০২৭-এর তৃতীয় ভাগ · নমুনা সময়সূচি",
    image: photos.jetty,
    status: "closing",
    milestones: [],
  },
  {
    id: "proj-solar",
    slug: "spa-wellness-pavilion",
    name: "Solar & Rainwater Commons",
    nameBn: "সৌর ও বৃষ্টির পানি কমন্স",
    eyebrow: "Island utilities",
    eyebrowBn: "দ্বীপ ইউটিলিটি",
    location: "Central ridge, Saint Martin’s Island (demo site)",
    locationBn: "মধ্য টিলা, সেন্ট মার্টিন দ্বীপ (ডেমো সাইট)",
    summary: "Canopy solar array, battery bank and rainwater filtration plant for the 24 keys.",
    summaryBn: "২৪টি ভিলার জন্য ক্যানোপি সৌর অ্যারে, ব্যাটারি ব্যাংক ও বৃষ্টির পানি পরিশোধন প্ল্যান্ট।",
    story: "Sample utility tranche on the web investor page.",
    storyBn: "বিনিয়োগকারী পাতার নমুনা ইউটিলিটি প্রকল্প।",
    pricePerShare: 300000,
    illustrativeYield: "Sample label only — not a forecast",
    totalShares: 500,
    soldShares: 310,
    reservedShares: 25,
    completion: "Q2 2027 · sample schedule",
    completionBn: "২০২৭-এর দ্বিতীয় ভাগ · নমুনা সময়সূচি",
    image: photos.land,
    status: "open",
    milestones: [],
  },
  {
    id: "proj-dining",
    slug: "mangrove-eco-lodges",
    name: "Ilish & Ember Beach Pavilion",
    nameBn: "ইলিশ অ্যান্ড এম্বার বিচ প্যাভিলিয়ন",
    eyebrow: "Dining & deck",
    eyebrowBn: "ডাইনিং ও ডেক",
    location: "South cove, Saint Martin’s Island (demo site)",
    locationBn: "দক্ষিণ উপসাগর, সেন্ট মার্টিন দ্বীপ (ডেমো সাইট)",
    summary: "Open-fire kitchen, low-tide chef’s deck and lagoon pool terrace — marked fully allocated.",
    summaryBn: "খোলা আগুনের রান্নাঘর, ভাটার শেফ ডেক এবং লেগুন পুল টেরেস — পূর্ণ বরাদ্দ চিহ্নিত।",
    story: "Sample dining tranche on the web investor page.",
    storyBn: "বিনিয়োগকারী পাতার নমুনা ডাইনিং প্রকল্প।",
    pricePerShare: 320000,
    illustrativeYield: "Sample label only — not a forecast",
    totalShares: 400,
    soldShares: 400,
    reservedShares: 0,
    completion: "Q1 2027 · sample schedule",
    completionBn: "২০২৭-এর প্রথম ভাগ · নমুনা সময়সূচি",
    image: photos.dining,
    status: "funded",
    milestones: [],
  },
];

export default async function InvestPage() {
  const repoProjects = await getRepo().listProjects();
  const projects = [...repoProjects, ...EXTRA_SHOWCASE_PROJECTS];
  const { lang, t } = await getLang();
  const totalShares = projects.reduce((sum, project) => sum + project.totalShares, 0);
  const soldShares = projects.reduce((sum, project) => sum + project.soldShares, 0);
  const reservedShares = projects.reduce((sum, project) => sum + project.reservedShares, 0);
  const open = projects.reduce((sum, project) => sum + remainingShares(project), 0);
  const portfolioPct = totalShares ? Math.round(((soldShares + reservedShares) / totalShares) * 100) : 0;

  const steps = [
    [
      "01",
      t("Browse sample tranches", "নমুনা প্রকল্প দেখুন"),
      t("Compare lagoon villas, wellness pavilions, solar utilities and marine infrastructure.", "লেগুন ভিলা, ওয়েলনেস প্যাভিলিয়ন, সৌর ইউটিলিটি ও সামুদ্রিক অবকাঠামো তুলনা করুন।"),
    ],
    [
      "02",
      t("Submit a share request", "শেয়ারের আবেদন পাঠান"),
      t("Pick between 1 and 40 sample shares with your name, email and Bangladeshi mobile number.", "নাম, ইমেইল ও মোবাইল নম্বর দিয়ে ১ থেকে ৪০টি নমুনা শেয়ারের আবেদন করুন।"),
    ],
    [
      "03",
      t("Admin console review", "অ্যাডমিন কনসোলে যাচাই"),
      t("Requests hold shares immediately and move to allocated when approved in the admin demo.", "আবেদন করলে শেয়ার সংরক্ষিত থাকে এবং অ্যাডমিন অনুমোদন করলে বরাদ্দে যুক্ত হয়।"),
    ],
    [
      "04",
      t("Open investor portal", "বিনিয়োগকারী পোর্টাল খুলুন"),
      t("Inspect sample holdings, distribution rows and quarterly notes in the dedicated portal.", "পোর্টালে নমুনা হোল্ডিং, বণ্টন তালিকা ও ত্রৈমাসিক নোট দেখুন।"),
    ],
  ];

  const pillars = [
    {
      Icon: PieChart,
      eyebrow: t("Cap-table mechanics", "ক্যাপ-টেবিল কাঠামো"),
      metric: `${formatNumber(portfolioPct, lang)}%`,
      title: t("Live JSON share ledger", "লাইভ জেসন শেয়ার লেজার"),
      copy: t(
        "Every project tracks allocated, held-by-request and open shares in real time across the web, investor and admin apps.",
        "প্রতিটি প্রকল্পের বরাদ্দ, আবেদনে ধরা এবং খোলা শেয়ার তিনটি অ্যাপেই তাৎক্ষণিক আপডেট হয়।",
      ),
    },
    {
      Icon: ShieldCheck,
      eyebrow: t("Governance & review", "গভর্ন্যান্স ও যাচাই"),
      metric: formatNumber(2, lang),
      title: t("Dedicated investor & admin portals", "পৃথক বিনিয়োগকারী ও অ্যাডমিন পোর্টাল"),
      copy: t(
        "Approvals happen in the admin console on port 3002 while holdings and payouts live in the investor portal on port 3001.",
        "অ্যাডমিন কনসোলে অনুমোদন দেওয়া হয় এবং বিনিয়োগকারী পোর্টালে হোল্ডিং ও পেআউট দেখা যায়।",
      ),
    },
    {
      Icon: FileText,
      eyebrow: t("Quarterly reporting", "ত্রৈমাসিক প্রতিবেদন"),
      metric: formatBdt(0, lang),
      title: t("Zero-payment paper demo", "পেমেন্টবিহীন ডেমো সংস্করণ"),
      copy: t(
        "No payment gateway, bank transfer or legal contract is triggered. All certificates and notes are clearly labelled placeholders.",
        "কোনো পেমেন্ট গেটওয়ে বা ব্যাংক লেনদেন হয় না। সব সনদ ও নোট শুধুমাত্র ডেমো প্লেসহোল্ডার।",
      ),
    },
  ];

  return (
    <main className="night">
      <PageBanner
        tone="navy"
        image={photos.reef}
        alt={t("Aerial of a small island in clear water", "স্বচ্ছ পানিতে ছোট একটি দ্বীপ, আকাশ থেকে")}
        eyebrow={t("Investor programme · not an offer", "বিনিয়োগকারী প্রোগ্রাম · অফার নয়")}
        title={lang === "bn" ? <>দ্বীপে বিনিয়োগের <em>একটি ডেমো।</em></> : <>Invest in the island, <em>as a demo.</em></>}
        lede={t(
          "Share counts live in this demo’s data file and change when an admin approves a request. Nothing here promises a return.",
          "শেয়ার সংখ্যা এই ডেমোর ডেটা ফাইলে থাকে। অ্যাডমিন অনুমোদন করলে তা বদলায়। কোনো রিটার্ন প্রতিশ্রুতি নেই।",
        )}
      />
      <section className="sec tight">
        <Scenery tone="night" />
        <div className="wrap">
          <div className="ledger lift-up">
            <div className="ledger-top">
              <dl>
                {([
                  { Icon: Building2, label: t("Sample projects", "নমুনা প্রকল্প"), value: formatNumber(projects.length, lang) },
                  { Icon: Layers, label: t("Total sample shares", "মোট নমুনা শেয়ার"), value: formatNumber(totalShares, lang) },
                  { Icon: CircleDashed, label: t("Shares still open", "খোলা শেয়ার"), value: formatNumber(open, lang) },
                  { Icon: Wallet, label: t("Payments taken", "নেওয়া পেমেন্ট"), value: formatBdt(0, lang) },
                ] as { Icon: LucideIcon; label: string; value: string }[]).map(({ Icon, label, value }) => (
                  <div key={label}>
                    <span className="medal"><Icon aria-hidden /></span>
                    <dd>{value}</dd>
                    <dt>{label}</dt>
                  </div>
                ))}
              </dl>
              <div className="ledger-cta">
                <p><LockKeyhole aria-hidden size={16} /> {t("Already applied? Holdings and quarterly notes are in the portal.", "আগেই আবেদন করেছেন? হোল্ডিং ও ত্রৈমাসিক নোট পোর্টালে।")}</p>
                <Button asChild variant="gold"><a href={siteUrls.investor}>{t("Investor portal login", "বিনিয়োগকারী পোর্টাল লগইন")} <ArrowRight /></a></Button>
              </div>
            </div>
            <div className="ledger-bar">
              <div className="ledger-bar-meta">
                <span>{t("Spoken for across the demo", "ডেমোতে বরাদ্দ")}</span>
                <b>{formatNumber(portfolioPct, lang)}%</b>
              </div>
              <div className="meter" role="img" aria-label={t(`${portfolioPct}% of sample shares are allocated or held`, `${portfolioPct}% নমুনা শেয়ার বরাদ্দ বা ধরা`)}>
                <i style={{ width: `${portfolioPct}%` }} />
              </div>
            </div>
          </div>

          <div className="head" style={{ marginTop: "clamp(56px, 6vw, 88px)" }}>
            <div>
              <span className="over">{t("Sample projects · 6 tranches", "নমুনা প্রকল্প · ৬টি ধাপ")}</span>
              <h2 className="serif-swap">{t("Six island tranches — on paper.", "কাগজে-কলমে দ্বীপের ছয়টি প্রকল্প।")}</h2>
            </div>
            <p className="lede" style={{ maxWidth: 420 }}>
              {t(
                "Each card shows its live allocation ring, progress bar, and remaining share count from the local demo store.",
                "প্রতিটি কার্ডে ডেমো স্টোর থেকে লাইভ বরাদ্দ বৃত্ত, অগ্রগতি বার এবং বাকি শেয়ারের সংখ্যা দেখানো হয়েছে।",
              )}
            </p>
          </div>

          <div className="projects">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} lang={lang} />
            ))}
          </div>

          <div className="head" style={{ marginTop: "clamp(72px, 8vw, 116px)" }}>
            <div>
              <span className="over">{t("Programme architecture", "প্রোগ্রামের কাঠামো")}</span>
              <h2 className="serif-swap">{t("How the investor desk fits together.", "বিনিয়োগকারী ডেস্ক যেভাবে কাজ করে।")}</h2>
            </div>
            <p className="lede" style={{ maxWidth: 420 }}>
              {t(
                "A structured overview of the application flow, masterplan zones, portal documents and cap-table rules.",
                "আবেদন প্রক্রিয়া, মাস্টারপ্ল্যান জোন, পোর্টাল ডকুমেন্ট এবং ক্যাপ-টেবিল নিয়মের একটি সুশৃঙ্খল চিত্র।",
              )}
            </p>
          </div>

          <div className="bento invest-bento">
            <article className="tile navy s7 r2">
              <div className="tile-top">
                <span className="over">{t("How it works · 4 steps", "কীভাবে কাজ করে · ৪ ধাপ")}</span>
                <span className="sample"><Sparkles size={12} aria-hidden /> {t("Interactive flow", "ইন্টারঅ্যাক্টিভ ফ্লো")}</span>
              </div>
              <h3 className="serif-swap" style={{ fontSize: "clamp(26px, 2.4vw, 36px)" }}>
                {t("From a public share request to an approved holding.", "পাবলিক শেয়ার আবেদন থেকে অনুমোদিত হোল্ডিং।")}
              </h3>
              <p className="lede">
                {t(
                  "Click any open project above to submit a sample request. No account is required to apply, and you can test the approval workflow yourself.",
                  "উপরের যেকোনো খোলা প্রকল্পে ক্লিক করে নমুনা আবেদন পাঠান। আবেদন করতে অ্যাকাউন্ট লাগে না।",
                )}
              </p>
              <ol className="bento-steps">
                {steps.map(([num, title, copy]) => (
                  <li key={num}>
                    <span className="bento-step-num">{num}</span>
                    <div>
                      <b>{title}</b>
                      <p>{copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="bento-alloc-box">
                <div className="panel-head">
                  <span className="over">{t("Combined demo cap table", "সম্মিলিত ডেমো ক্যাপ টেবিল")}</span>
                  <span className="help">
                    {t(
                      `${formatNumber(soldShares + reservedShares, lang)} of ${formatNumber(totalShares, lang)} shares spoken for (${formatNumber(portfolioPct, lang)}%)`,
                      `${formatNumber(totalShares, lang)}টির মধ্যে ${formatNumber(soldShares + reservedShares, lang)}টি শেয়ার বরাদ্দ (${formatNumber(portfolioPct, lang)}%)`,
                    )}
                  </span>
                </div>
                <div className="meter"><i style={{ width: `${portfolioPct}%` }} /></div>
              </div>
            </article>

            <figure className="tile media s5" style={{ margin: 0, minHeight: 280 }}>
              <div className="photo">
                <Image src={photos.walkways} alt={t("Overwater walkways from above", "উপর থেকে জলের উপরের হাঁটার পথ")} fill sizes="(max-width: 760px) 100vw, 42vw" />
              </div>
              <div className="shade" />
              <figcaption className="tile-cap">
                <span className="glass"><Building2 size={13} aria-hidden /> {t("Saint Martin’s · Masterplan", "সেন্ট মার্টিন · মাস্টারপ্ল্যান")}</span>
                <h3 className="serif-swap">{t("Low-density stilts & solar commons.", "কম ঘনত্বের স্টিল্ট ও সৌর কমন্স।")}</h3>
                <p>{t("Six sample tranches span overwater villas, wellness pavilions, and off-grid island utilities.", "ছয়টি নমুনা প্রকল্পে রয়েছে ওভারওয়াটার ভিলা, ওয়েলনেস প্যাভিলিয়ন ও দ্বীপ ইউটিলিটি।")}</p>
              </figcaption>
            </figure>

            <article className="tile teal s5">
              <div className="tile-top">
                <span className="over">{t("Investor portal · Demo", "বিনিয়োগকারী পোর্টাল · ডেমো")}</span>
                <span className="sample">{t("Port 3001", "পোর্ট ৩০০১")}</span>
              </div>
              <h3 className="serif-swap">{t("Inspect sample holdings, payouts & notes.", "নমুনা হোল্ডিং, পেআউট ও নোট দেখুন।")}</h3>
              <p className="lede">
                {t(
                  "Sign in as Shirin Akter (shirin.akter@sundrop.demo / sundrop-demo) to view a pre-populated portfolio, distribution schedule, and downloadable notes.",
                  "শিরিন আক্তার (shirin.akter@sundrop.demo / sundrop-demo) হিসেবে লগইন করে নমুনা পোর্টফোলিও ও ত্রৈমাসিক নোট দেখুন।",
                )}
              </p>
              <div className="tile-foot">
                <Button asChild variant="gold" size="sm">
                  <a href={siteUrls.investor}>{t("Open investor portal", "বিনিয়োগকারী পোর্টাল খুলুন")} <ArrowRight /></a>
                </Button>
                <Button asChild variant="goldGhost" size="sm">
                  <a href={siteUrls.admin}>{t("Admin demo", "অ্যাডমিন ডেমো")}</a>
                </Button>
              </div>
            </article>

            {pillars.map(({ Icon, eyebrow, metric, title, copy }) => (
              <article className="tile navy lift s4" key={title}>
                <div className="tile-top">
                  <span className="medal"><Icon aria-hidden /></span>
                  <span className="num">{metric}</span>
                </div>
                <span className="over">{eyebrow}</span>
                <h3 className="serif-swap">{title}</h3>
                <p className="lede">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        image={photos.beach}
        eyebrow={t("Questions or custom walkthrough?", "প্রশ্ন বা ডেমো ওয়াকথ্রু?")}
        title={t("Talk to the resort & investor desk.", "রিসোর্ট ও বিনিয়োগকারী ডেস্কে কথা বলুন।")}
        copy={t(
          "Want to experience the guest side too? Browse the 24 sample villa keys or send a note to the desk.",
          "অতিথিদের দিকটিও দেখতে চান? ২৪টি নমুনা ভিলা দেখুন অথবা ডেস্কে একটি বার্তা পাঠান।",
        )}
      >
        <Button asChild variant="gold"><Link href="/villas">{t("Explore villas", "ভিলাগুলো দেখুন")} <ArrowRight /></Link></Button>
        <Button asChild variant="ghostLight"><Link href="/contact">{t("Contact the desk", "ডেস্কে যোগাযোগ")}</Link></Button>
      </CtaBand>
    </main>
  );
}

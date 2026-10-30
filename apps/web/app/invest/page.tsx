import { getRepo, remainingShares } from "@sundrop/data";
import { formatBdt, siteUrls } from "@sundrop/ui";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Invest" };

export default async function InvestPage() {
  const projects = await getRepo().listProjects();
  const lang = (await cookies()).get("lang")?.value === "bn" ? "bn" : "en";
  return (
    <main className="dark-page">
      <div className="wrap page-hero" style={{ paddingBottom: 80 }}>
        <p className="sample">Illustrative placeholders · not an offer</p>
        <h1 style={{ color: "var(--ivory)" }}>{lang === "bn" ? "দ্বীপে বিনিয়োগের একটি ডেমো।" : "Invest in the island, as a demo."}</h1>
        <p className="lede" style={{ maxWidth: 680 }}>
          {lang === "bn"
            ? "শেয়ার সংখ্যা এই ডেমোর ডেটা ফাইলে থাকে। অ্যাডমিন অনুমোদন করলে তা বদলায়। কোনো রিটার্ন প্রতিশ্রুতি নেই।"
            : "Share counts live in this demo’s data file and change when an admin approves a request. Nothing here promises a return."}
        </p>
        <div className="stat-row" style={{ margin: "28px 0" }}>
          {[
            [lang === "bn" ? "নমুনা প্রকল্প" : "Sample projects", String(projects.length)],
            [lang === "bn" ? "খোলা আবেদন" : "Open requests", "See admin"],
            [lang === "bn" ? "পেমেন্ট" : "Payments", lang === "bn" ? "নেওয়া হয় না" : "None taken"],
            [lang === "bn" ? "পোর্টাল" : "Portal", lang === "bn" ? "ডেমো লগইন" : "Demo login"],
          ].map(([label, value]) => (
            <div className="stat" key={label}><b>{value}</b><span>{label}</span></div>
          ))}
        </div>
        <div className="villas">
          {projects.map((project) => (
            <article className="proj" key={project.id}>
              <div className="photo" style={{ height: 180 }}>
                <Image src={project.image} alt="" fill sizes="33vw" />
              </div>
              <div style={{ padding: 22 }}>
                <span className="over" style={{ color: "var(--gold)" }}>{lang === "bn" ? project.eyebrowBn : project.eyebrow}</span>
                <h2 style={{ fontSize: 28, color: "white" }}>{lang === "bn" ? project.nameBn : project.name}</h2>
                <p className="lede">{lang === "bn" ? project.summaryBn : project.summary}</p>
                <p>{lang === "bn" ? "বাকি নমুনা শেয়ার" : "Sample shares left"} · {remainingShares(project)} / {project.totalShares}</p>
                <p>{lang === "bn" ? "প্রতি শেয়ার" : "Per share"} · {formatBdt(project.pricePerShare, lang)} · <span className="sample">{project.illustrativeYield}</span></p>
                <Link className="more" href={`/invest/${project.slug}`} style={{ color: "var(--gold-300)" }}>{lang === "bn" ? "প্রকল্প দেখুন" : "View project"} →</Link>
              </div>
            </article>
          ))}
        </div>
        <p style={{ marginTop: 28 }}><a href={siteUrls.investor}>{lang === "bn" ? "বিনিয়োগকারী লগইন" : "Investor login"} →</a></p>
      </div>
    </main>
  );
}

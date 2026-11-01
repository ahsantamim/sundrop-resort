import { getRepo, remainingShares } from "@sundrop/data";
import { Button, formatBdt, formatNumber, siteUrls } from "@sundrop/ui";
import {
  ArrowRight,
  BadgeInfo,
  CalendarClock,
  CheckCircle2,
  Circle,
  CircleDashed,
  Coins,
  Handshake,
  Hourglass,
  Layers,
  LayoutDashboard,
  MapPin,
  PieChart,
  Send,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/chrome/page-banner";
import { Scenery } from "@/components/chrome/scenery";
import { ApplyForm } from "@/components/invest/apply-form";
import { ShareRing, takenPercent } from "@/components/invest/share-ring";
import { getLang } from "@/lib/lang";

const STATUS = {
  open: ["Open · sample", "খোলা · নমুনা"],
  closing: ["Closing · sample", "শেষের পথে · নমুনা"],
  funded: ["Funded · sample", "পূর্ণ · নমুনা"],
} as const;

/** Reads the seed's milestone wording: "Marked done…", "Sample progress · 60%", or anything else = not started. */
function milestoneStage(state: string) {
  if (/done|complete/i.test(state)) return { stage: "done" as const, pct: 100 };
  const pct = /(\d+)\s*%/.exec(state);
  if (pct) return { stage: "active" as const, pct: Number(pct[1]) };
  return { stage: "next" as const, pct: 0 };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = await getRepo().getProject((await params).slug);
  return { title: project?.name ?? "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getRepo().getProject((await params).slug);
  if (!project) notFound();
  const { lang, t } = await getLang();
  const left = remainingShares(project);
  const taken = takenPercent(project);
  const share = (n: number) => (project.totalShares ? (n / project.totalShares) * 100 : 0);
  const [statusEn, statusBn] = STATUS[project.status];
  const n = (value: number) => formatNumber(value, lang);
  const figures: { Icon: LucideIcon; value: string; label: string }[] = [
    { Icon: Coins, value: formatBdt(project.pricePerShare, lang), label: t("Sample price per share", "প্রতি শেয়ারের নমুনা দাম") },
    { Icon: PieChart, value: `${n(left)} / ${n(project.totalShares)}`, label: t("Shares still open", "খোলা শেয়ার") },
    { Icon: Handshake, value: n(project.soldShares), label: t("Sample allocated", "নমুনা বরাদ্দ") },
    { Icon: Hourglass, value: n(project.reservedShares), label: t("Held by requests", "আবেদনে ধরা") },
  ];
  const nextSteps: { Icon: LucideIcon; title: string; copy: string }[] = [
    { Icon: Send, title: t("Send an application", "আবেদন পাঠান"), copy: t("Name, email, mobile and a share count. Nothing is charged.", "নাম, ইমেইল, মোবাইল ও শেয়ার সংখ্যা। কিছু কাটা হয় না।") },
    { Icon: ShieldCheck, title: t("Admin decides", "অ্যাডমিন সিদ্ধান্ত নেন"), copy: t("Approve or decline in the admin demo.", "অ্যাডমিন ডেমোতে অনুমোদন বা প্রত্যাখ্যান।") },
    { Icon: LayoutDashboard, title: t("Open the dashboard", "ড্যাশবোর্ড খুলুন"), copy: t("Sample holdings and quarterly notes in the portal.", "পোর্টালে নমুনা হোল্ডিং ও ত্রৈমাসিক নোট।") },
  ];

  return (
    <main className="night">
      <PageBanner
        tone="navy"
        image={project.image}
        alt=""
        eyebrow={t(`${project.eyebrow} · placeholder, not an offer`, `${project.eyebrowBn} · প্লেসহোল্ডার, অফার নয়`)}
        title={t(project.name, project.nameBn)}
        lede={t(project.summary, project.summaryBn)}
      >
        <div className="banner-chips">
          <span className={`status-chip ${project.status}`}><i />{t(statusEn, statusBn)}</span>
          <span className="glass"><MapPin size={14} aria-hidden /> {t(project.location, project.locationBn)}</span>
        </div>
      </PageBanner>

      <section className="sec tight">
        <Scenery tone="night" />
        <div className="wrap">
          <div className="term lift-up">
            <div className="term-ring">
              <ShareRing value={taken} digits={n(taken)} label={t("spoken for", "বরাদ্দ")} size={176} />
            </div>
            <div className="term-figs">
              {figures.map(({ Icon, value, label }) => (
                <div key={label}>
                  <span className="medal"><Icon aria-hidden /></span>
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="term-cta">
              <Button asChild variant="gold"><a href="#apply">{t("Apply for shares", "শেয়ারের জন্য আবেদন")} <ArrowRight /></a></Button>
              <Button asChild variant="goldGhost"><a href={siteUrls.investor}>{t("Investor portal login", "বিনিয়োগকারী লগইন")}</a></Button>
              <span className="help">{t("No payment is taken in this demo.", "এই ডেমোতে কোনো পেমেন্ট নেওয়া হয় না।")}</span>
            </div>
          </div>

          <div className="panel alloc-panel">
            <div className="panel-head">
              <span className="over">{t("Share allocation", "শেয়ার বরাদ্দ")}</span>
              <span className="help">{t(`${n(project.totalShares)} sample shares in total`, `মোট ${n(project.totalShares)}টি নমুনা শেয়ার`)}</span>
            </div>
            <div className="alloc" role="img" aria-label={t(`${taken}% allocated or held`, `${taken}% বরাদ্দ বা ধরা`)}>
              <i className="sold" style={{ width: `${share(project.soldShares)}%` }} />
              {project.reservedShares > 0 ? <i className="held" style={{ width: `${share(project.reservedShares)}%` }} /> : null}
            </div>
            <ul className="legend">
              <li><i className="sold" />{t("Allocated", "বরাদ্দ")}<b>{n(project.soldShares)}</b></li>
              <li><i className="held" />{t("Held by requests", "আবেদনে ধরা")}<b>{n(project.reservedShares)}</b></li>
              <li><i className="open" />{t("Open", "খোলা")}<b>{n(left)}</b></li>
            </ul>
          </div>

          <div className="pgrid">
            <article className="panel">
              <span className="over">{t("The project", "প্রকল্প")}</span>
              <p className="pull serif-swap">{t(project.story, project.storyBn)}</p>
              <ul className="glance">
                <li><span className="medal"><MapPin aria-hidden /></span><div><small>{t("Where", "কোথায়")}</small>{t(project.location, project.locationBn)}</div></li>
                <li><span className="medal"><CalendarClock aria-hidden /></span><div><small>{t("Completion", "সমাপ্তি")}</small>{t(project.completion, project.completionBn)}</div></li>
                <li><span className="medal"><Layers aria-hidden /></span><div><small>{t("Total shares", "মোট শেয়ার")}</small>{n(project.totalShares)}</div></li>
                <li><span className="medal"><BadgeInfo aria-hidden /></span><div><small>{t("Yield label", "রিটার্ন লেবেল")}</small>{project.illustrativeYield}</div></li>
              </ul>
            </article>
            <article className="panel">
              <span className="over">{t("Sample progress", "নমুনা অগ্রগতি")}</span>
              <ol className="mtrack">
                {project.milestones.map((milestone) => {
                  const { stage, pct } = milestoneStage(milestone.state);
                  const Icon = stage === "done" ? CheckCircle2 : stage === "active" ? CircleDashed : Circle;
                  return (
                    <li key={milestone.label} className={stage}>
                      <span className="node"><Icon aria-hidden /></span>
                      <div>
                        <b>{t(milestone.label, milestone.labelBn)}</b>
                        <small>{t(milestone.state, milestone.stateBn)}</small>
                        {stage === "active" ? <span className="mini"><i style={{ width: `${pct}%` }} /></span> : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </article>
          </div>

          <div className="pgrid" id="apply" style={{ scrollMarginTop: 110, alignItems: "start" }}>
            <article className="panel apply-panel">
              <ApplyForm project={project} />
            </article>
            <article className="panel">
              <span className="over">{t("What happens next", "এরপর কী হয়")}</span>
              <ol className="mtrack steps">
                {nextSteps.map(({ Icon, title, copy }) => (
                  <li key={title} className="done">
                    <span className="node"><Icon aria-hidden /></span>
                    <div><b>{title}</b><small>{copy}</small></div>
                  </li>
                ))}
              </ol>
              <Button asChild variant="goldGhost" size="sm" style={{ alignSelf: "flex-start", marginTop: "auto" }}>
                <a href={siteUrls.investor}>{t("Investor portal login", "বিনিয়োগকারী লগইন")} <ArrowRight /></a>
              </Button>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

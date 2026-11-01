import { remainingShares, type Project } from "@sundrop/data/types";
import { formatBdt, formatNumber, type Lang } from "@sundrop/ui";
import { ArrowUpRight, CalendarClock, Layers, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ShareRing, takenPercent } from "./share-ring";

const STATUS = {
  open: ["Open · sample", "খোলা · নমুনা"],
  closing: ["Closing · sample", "শেষের পথে · নমুনা"],
  funded: ["Funded · sample", "পূর্ণ · নমুনা"],
} as const;

export function ProjectCard({
  project,
  lang,
}: {
  project: Project;
  lang: Lang;
  shape?: "arch" | "villa";
}) {
  const t = (en: string, bn: string) => (lang === "bn" ? bn : en);
  const taken = takenPercent(project);
  const left = remainingShares(project);
  const [statusEn, statusBn] = STATUS[project.status];

  return (
    <Link href={`/invest/${project.slug}`} className="pcard">
      <div className="pcard-media">
        <div className="photo pcard-photo">
          <Image src={project.image} alt={t(project.name, project.nameBn)} fill sizes="(max-width: 900px) 100vw, 33vw" />
        </div>
        <span className={`status-chip ${project.status}`}><i />{t(statusEn, statusBn)}</span>
      </div>
      <div className="pcard-body">
        <div className="pcard-head">
          <div>
            <span className="over">{t(project.eyebrow, project.eyebrowBn)}</span>
            <h3 className="serif-swap">{t(project.name, project.nameBn)}</h3>
          </div>
          <ShareRing value={taken} digits={formatNumber(taken, lang)} label={t("taken", "নেওয়া")} size={68} />
        </div>
        <p className="lede">{t(project.summary, project.summaryBn)}</p>
        <div className="pcard-alloc">
          <div className="meter" aria-hidden="true">
            <i style={{ width: `${taken}%` }} />
          </div>
          <div className="pcard-alloc-meta">
            <span>{t(`${formatNumber(project.soldShares, lang)} allocated`, `${formatNumber(project.soldShares, lang)} বরাদ্দ`)}</span>
            <span>{t(`${formatNumber(left, lang)} open`, `${formatNumber(left, lang)} খোলা`)}</span>
          </div>
        </div>
        <ul className="facts">
          <li><MapPin aria-hidden /><span>{t(project.location, project.locationBn)}</span></li>
          <li><CalendarClock aria-hidden /><span>{t(project.completion, project.completionBn)}</span></li>
          <li><Layers aria-hidden /><span>{t(`${formatNumber(project.totalShares, lang)} sample shares total`, `মোট ${formatNumber(project.totalShares, lang)}টি নমুনা শেয়ার`)}</span></li>
        </ul>
        <div className="pcard-foot">
          <div className="pcard-price">
            <small>{t("Per share · sample", "প্রতি শেয়ার · নমুনা")}</small>
            <b>{formatBdt(project.pricePerShare, lang)}</b>
          </div>
          <span className="pcard-go" aria-hidden><ArrowUpRight /></span>
        </div>
      </div>
    </Link>
  );
}

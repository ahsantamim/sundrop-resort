import { getRepo, remainingShares } from "@sundrop/data";
import { formatBdt } from "@sundrop/ui";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ApplyForm } from "@/components/invest/apply-form";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = await getRepo().getProject((await params).slug);
  return { title: project?.name ?? "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getRepo().getProject((await params).slug);
  if (!project) notFound();
  const lang = (await cookies()).get("lang")?.value === "bn" ? "bn" : "en";
  const left = remainingShares(project);
  return (
    <main className="dark-page">
      <div className="wrap page-hero" style={{ paddingBottom: 80 }}>
        <p className="sample">Placeholder project · not an offer</p>
        <h1 style={{ color: "white" }}>{lang === "bn" ? project.nameBn : project.name}</h1>
        <p className="lede">{lang === "bn" ? project.locationBn : project.location}</p>
        <div className="photo" style={{ height: 360, borderRadius: 28, margin: "24px 0" }}>
          <Image src={project.image} alt="" fill sizes="100vw" />
        </div>
        <div className="stat-row">
          <div className="stat"><b>{formatBdt(project.pricePerShare, lang)}</b><span>{lang === "bn" ? "নমুনা দাম / শেয়ার" : "Sample price / share"}</span></div>
          <div className="stat"><b>{left}</b><span>{lang === "bn" ? "বাকি" : "Remaining"}</span></div>
          <div className="stat"><b>{project.soldShares}</b><span>{lang === "bn" ? "নমুনা বরাদ্দ" : "Sample allocated"}</span></div>
          <div className="stat"><b>{project.reservedShares}</b><span>{lang === "bn" ? "আবেদনে ধরা" : "Held by requests"}</span></div>
        </div>
        <p className="lede" style={{ marginTop: 24 }}>{lang === "bn" ? project.storyBn : project.story}</p>
        <p className="sample">{project.illustrativeYield}</p>
        <h2 style={{ color: "white", fontSize: 32 }}>{lang === "bn" ? "নমুনা অগ্রগতি" : "Sample progress"}</h2>
        <ul>
          {project.milestones.map((milestone) => (
            <li key={milestone.label}>{lang === "bn" ? milestone.labelBn : milestone.label} — {lang === "bn" ? milestone.stateBn : milestone.state}</li>
          ))}
        </ul>
        <div className="ip-card" style={{ marginTop: 24, maxWidth: 560 }}>
          <ApplyForm project={project} />
        </div>
      </div>
    </main>
  );
}

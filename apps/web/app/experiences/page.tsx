import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Experiences" };

const items = [
  ["Shapla Spa", "Sample spa menu. No appointments are booked from this page."],
  ["Ilish & Ember", "Sample dining note. Breakfast is mentioned inside the sample villa rate."],
  ["Reef & Jetty", "Saint Martin’s snorkel, kayak and boat time, described only."],
  ["Sunset Deck", "A west-facing hour on the sample day plan."],
];

export default function ExperiencesPage() {
  return (
    <main>
      <div className="wrap page-hero" style={{ paddingBottom: 80 }}>
        <span className="over">Experiences</span>
        <h1>Slow days, salt air and very good fish.</h1>
        <div className="villas" style={{ marginTop: 28 }}>
          {items.map(([title, copy]) => (
            <article className="villa" key={title}><div className="body"><h3>{title}</h3><p className="meta">{copy}</p><span className="sample">Sample</span></div></article>
          ))}
        </div>
        <p style={{ marginTop: 24 }}><Link href="/#amenities">See them on the landing page →</Link></p>
      </div>
    </main>
  );
}

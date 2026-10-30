import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dining" };

export default function DiningPage() {
  return (
    <main>
      <div className="wrap page-hero" style={{ paddingBottom: 80 }}>
        <span className="over">Dining</span>
        <h1>Three tables, on paper.</h1>
        <p className="lede">Ilish & Ember is the only dining room named in the demo. There is no live menu and no reservation.</p>
        <div className="villas">
          {["Shutki and rice, as a sample line", "A low-tide chef’s table, described only", "Breakfast folded into the sample villa rate"].map((line) => (
            <article key={line} className="villa"><div className="body"><p>{line}</p><span className="sample">Sample</span></div></article>
          ))}
        </div>
      </div>
    </main>
  );
}

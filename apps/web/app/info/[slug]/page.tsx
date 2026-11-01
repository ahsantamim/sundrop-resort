import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Scenery } from "@/components/chrome/scenery";

const pages: Record<string, { title: string; body: string }> = {
  privacy: {
    title: "Privacy",
    body: "This demo keeps bookings, applications and sessions in a JSON file on the machine running the apps. Do not enter real identity documents or real card numbers. There is no separate privacy office.",
  },
  terms: {
    title: "Terms",
    body: "SUNDROP Eco Resort in this repository is a demonstration. Confirming a booking creates a sample record. It does not create a stay, a payment, or a contract.",
  },
  refunds: {
    title: "Refund policy",
    body: "No money is taken. Guest cancellation is allowed until 72 hours before check-in and only changes the sample record to cancelled. After that the demo refuses the cancel.",
  },
  offers: {
    title: "Offers",
    body: "There are no promotional offers. Every rate on the site is a sample figure.",
  },
  sustainability: {
    title: "Sustainability",
    body: "Solar, rainwater and plastic lines on the about page are layout labels. They are not measured performance.",
  },
  careers: {
    title: "Careers",
    body: "This demo does not list jobs.",
  },
  press: {
    title: "Press",
    body: "There is no press office and no awards to cite.",
  },
};

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => ({ title: pages[slug]?.title ?? "Info" }));
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = pages[(await params).slug];
  if (!page) notFound();
  return (
    <main>
      <div className="wrap page-head">
        <span className="over">Demo notice</span>
        <h1 className="serif-swap">{page.title}</h1>
      </div>
      <section className="sec tight flush-top">
        <Scenery />
        <div className="wrap">
          <div className="bento">
            <article className="tile s8">
              <p className="lede" style={{ fontSize: 18 }}>{page.body}</p>
            </article>
            <article className="tile sand s4">
              <span className="over">More notices</span>
              {Object.entries(pages).map(([key, item]) => (
                <Link className="more" href={`/info/${key}`} key={key} aria-current={item === page ? "page" : undefined} style={item === page ? { color: "var(--coral)" } : undefined}>
                  {item.title}
                </Link>
              ))}
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

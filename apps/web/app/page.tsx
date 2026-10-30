import { getRepo } from "@sundrop/data";
import { Closing } from "@/components/home/closing";
import { Hero } from "@/components/home/hero";
import { InvestorParallax } from "@/components/home/investor-parallax";
import { Stay } from "@/components/home/stay";

export default async function HomePage() {
  const villas = await getRepo().listVillas();
  return (
    <main id="top">
      <Hero />
      <Stay villas={villas.slice(0, 3)} />
      <InvestorParallax />
      <Closing />
    </main>
  );
}

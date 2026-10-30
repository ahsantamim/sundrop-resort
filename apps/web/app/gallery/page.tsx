import { photos } from "@sundrop/data/images";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Gallery" };

const shots = [photos.walkways, photos.boats, photos.bedroom, photos.nightPool, photos.lagoon, photos.beach, photos.spa, photos.dining, photos.palms, photos.deck, photos.island, photos.coast];

export default function GalleryPage() {
  return (
    <main className="dark-page">
      <div className="wrap page-hero" style={{ paddingBottom: 80 }}>
        <h1 style={{ color: "white" }}>Moments from the island</h1>
        <p className="lede">Unsplash frames used as the demo gallery. Not a commissioned shoot.</p>
        <div className="villas" style={{ marginTop: 28 }}>
          {shots.map((src) => (
            <div className="photo" key={src} style={{ height: 240, borderRadius: 24 }}>
              <Image src={src} alt="Island or resort photograph from Unsplash" fill sizes="33vw" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

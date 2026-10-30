import { photos } from "@sundrop/data/images";
import { Mark } from "@sundrop/ui";
import Image from "next/image";
import { signInInvestor } from "@/lib/actions";
import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <main className="login">
      <section style={{ position: "relative", minHeight: 320 }}>
        <Image src={photos.nightPool} alt="Resort lights at dusk, used as the sign-in backdrop" fill priority sizes="60vw" style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,30,46,.2), rgba(15,30,46,.72))" }} />
        <div style={{ position: "relative", zIndex: 1, padding: 48, maxWidth: 520 }}>
          <Mark />
          <p className="sample" style={{ marginTop: 24 }}>Investor circle · demo</p>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 68px)" }}>Quietly building lasting value.</h1>
          <p>Track sample shares, placeholder payouts and project notes. Nothing in this portal is a real holding.</p>
        </div>
      </section>
      <section style={{ display: "grid", placeItems: "center", padding: 32 }}>
        <LoginForm action={signInInvestor} />
        <p className="muted" style={{ maxWidth: 420 }}>
          Protected by a demo session cookie. Two-factor authentication is drawn in the source design and is not enforced here. The session lasts 12 hours.
        </p>
      </section>
    </main>
  );
}

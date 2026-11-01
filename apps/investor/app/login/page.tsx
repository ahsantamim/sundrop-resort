import { photos } from "@sundrop/data/images";
import { Mark } from "@sundrop/ui";
import Image from "next/image";
import { signInInvestor } from "@/lib/actions";
import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <main className="login">
      <section className="login-copy">
        <Image src={photos.nightPool} alt="Resort lights at dusk, used as the sign-in backdrop" fill priority sizes="60vw" style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,30,46,.25), rgba(15,30,46,.82))" }} />
        <div>
          <Mark />
          <p className="sample" style={{ marginTop: 18 }}>Partner portal · demo</p>
          <h1>The desk for sample holdings.</h1>
          <p>Shares, payout lines and notes in one compact view. Nothing here is a real holding.</p>
        </div>
      </section>
      <section className="login-panel">
        <LoginForm action={signInInvestor} />
        <p className="muted">Demo session cookie, 12 hours. Two-factor is drawn in the design and is not enforced.</p>
      </section>
    </main>
  );
}

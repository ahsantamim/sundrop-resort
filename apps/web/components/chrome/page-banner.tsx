import Image from "next/image";

/** Photo banner for inner pages, built from the landing hero: dark shade, marigold eyebrow, light serif title, drifting wave. */
export function PageBanner({
  image,
  alt,
  eyebrow,
  title,
  lede,
  tone = "ivory",
  children,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tone?: "ivory" | "navy";
  children?: React.ReactNode;
}) {
  return (
    <section className={`banner ${tone}`}>
      <div className="photo banner-media">
        <Image src={image} alt={alt} fill priority sizes="100vw" />
      </div>
      <div className="banner-shade" />
      <div className="wrap banner-in">
        <span className="over">{eyebrow}</span>
        <h1 className="serif-swap">{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
        {children}
      </div>
      <div className="banner-wave" aria-hidden="true">
        <svg viewBox="0 0 2880 90" preserveAspectRatio="none">
          <path d="M0 50 C240 10 480 10 720 50 S1200 90 1440 50 S1920 10 2160 50 S2640 90 2880 50 V90 H0Z" />
        </svg>
      </div>
    </section>
  );
}

/** Closing photo band from the landing page. */
export function CtaBand({
  image,
  eyebrow,
  title,
  copy,
  children,
}: {
  image: string;
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cta">
      <div className="wrap">
        <div className="cta-box">
          <div className="photo"><Image src={image} alt="" fill sizes="100vw" /></div>
          <div className="shade" />
          <div className="cta-in">
            <div>
              <span className="over">{eyebrow}</span>
              <h2 className="serif-swap">{title}</h2>
              <p>{copy}</p>
            </div>
            <div className="stack">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

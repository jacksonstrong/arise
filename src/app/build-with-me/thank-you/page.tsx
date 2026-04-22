import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Thank You — AUREA",
  description: "Your note has reached Jackson.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main
      style={{
        background: "var(--ink)",
        minHeight: "100vh",
        color: "var(--parchment)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px 80px",
      }}
    >
      <Image src="/aurea-logo.png" alt="AUREA" width={88} height={68} priority style={{ opacity: 0.92, marginBottom: 64 }} />
      <div style={{ maxWidth: 640, textAlign: "center" }}>
        <p className="eyebrow" style={{ marginBottom: 32, color: "var(--gold-dark)" }}>
          A note back
        </p>

        <h1
          style={{
            fontFamily: "var(--font-heading-stack)",
            fontSize: "clamp(56px, 9vw, 96px)",
            fontWeight: 300,
            lineHeight: 1.05,
            marginBottom: 40,
            letterSpacing: "-0.02em",
          }}
        >
          Received.
        </h1>

        {/* Ornament */}
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            maxWidth: 260,
            margin: "0 auto 48px",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--gold-dark))" }} />
          <div style={{ color: "var(--gold)", fontSize: 14 }}>&#10022;</div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--gold-dark), transparent)" }} />
        </div>

        <p
          style={{
            fontSize: 19,
            lineHeight: 1.85,
            color: "rgba(247, 243, 236, 0.88)",
            marginBottom: 20,
          }}
        >
          Thank you for the care you put into that.
        </p>
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.85,
            color: "rgba(247, 243, 236, 0.88)",
            marginBottom: 20,
          }}
        >
          I&rsquo;ll read every word myself within the next 48 hours — and come back to you directly with something built for what you actually need.
        </p>
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.85,
            color: "rgba(247, 243, 236, 0.88)",
          }}
        >
          Check your email. Keep your phone close.
        </p>

        <p
          style={{
            fontFamily: "var(--font-heading-stack)",
            fontSize: 26,
            fontStyle: "italic",
            color: "var(--gold)",
            marginTop: 64,
            lineHeight: 1.5,
          }}
        >
          Love &amp; Strength,
          <br />
          Jackson
        </p>
      </div>
    </main>
  );
}

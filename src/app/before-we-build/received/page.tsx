import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Received — AUREA",
  description: "Thank you for the care you put into that.",
  robots: { index: false, follow: false },
};

export default function ReceivedPage() {
  return (
    <main style={{
      background: "var(--ink)",
      minHeight: "100vh",
      color: "var(--parchment)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px",
    }}>
      <div style={{ maxWidth: 640, textAlign: "center" }}>
        <p className="eyebrow" style={{ marginBottom: 32 }}>
          A note back
        </p>
        <h1 style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: "clamp(56px, 9vw, 96px)",
          fontWeight: 300,
          lineHeight: 1.05,
          marginBottom: 56,
          letterSpacing: "-0.02em",
        }}>
          Received.
        </h1>
        <p style={{
          fontSize: 19,
          lineHeight: 1.85,
          color: "rgba(247, 243, 236, 0.85)",
          marginBottom: 20,
        }}>
          Thank you for the care you put into that.
        </p>
        <p style={{
          fontSize: 19,
          lineHeight: 1.85,
          color: "rgba(247, 243, 236, 0.85)",
        }}>
          I&rsquo;ll read every word myself within the next 48 hours, and you&rsquo;ll hear back from me or Adhara directly.
        </p>
        <p style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: 24,
          fontStyle: "italic",
          color: "var(--gold)",
          marginTop: 56,
        }}>
          — Jackson
        </p>
      </div>
    </main>
  );
}

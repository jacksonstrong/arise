import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Attunement — ARISE Challenge | AUREA Leaders",
  description: "Before Day 1, take a moment to meet Serafina — our Sovereign AI — and prepare for the journey ahead.",
};

const SERAFINA_URL = "https://serafina.aurealeaders.com/trial";

const QUESTIONS = [
  "What type of transformation work do you do?",
  "What's your biggest obstacle right now?",
  "What do you most want to walk away with from ARISE?",
  "Do you know your Human Design type?",
  "Where are you in your business journey?",
  "What would it mean for you to fully show up for all 7 days?",
  "What do you most want Jackson to know about you before you arrive?",
];

export default function AttunementPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--ink)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 24px",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: 600, marginBottom: 72 }}>
        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--gold)",
          marginBottom: 24,
        }}>
          ARISE Challenge · Pre-Event Attunement
        </p>
        <h1 style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: "clamp(38px, 5.5vw, 64px)",
          fontWeight: 300,
          color: "var(--parchment)",
          lineHeight: 1.15,
          marginBottom: 28,
        }}>
          You&rsquo;re In.<br />
          <em style={{ color: "var(--gold)" }}>Now Let&rsquo;s Get You Ready.</em>
        </h1>
        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 17,
          lineHeight: 1.75,
          color: "rgba(247, 243, 236, 0.75)",
          marginBottom: 12,
        }}>
          Before April 21, we&rsquo;d love for you to have a conversation with <strong style={{ color: "var(--parchment)" }}>Serafina</strong> — our Sovereign AI, built specifically for transformation leaders like you.
        </p>
        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 17,
          lineHeight: 1.75,
          color: "rgba(247, 243, 236, 0.75)",
        }}>
          She&rsquo;ll help us understand where you are, what you&rsquo;re carrying, and how to make these 7 days as powerful as possible for you personally.
        </p>
      </div>

      {/* Divider */}
      <div style={{
        width: "100%",
        maxWidth: 560,
        height: 1,
        background: "var(--ash-dark)",
        marginBottom: 64,
      }} />

      {/* What Serafina will ask */}
      <div style={{ width: "100%", maxWidth: 560, marginBottom: 72 }}>
        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--gold-dark)",
          marginBottom: 32,
          textAlign: "center",
        }}>
          She&rsquo;ll explore things like
        </p>
        {QUESTIONS.map((q, i) => (
          <div key={i} style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: i < QUESTIONS.length - 1 ? "1px solid var(--ash-dark)" : "none",
          }}>
            <span style={{
              fontFamily: "var(--font-heading-stack)",
              fontSize: 18,
              color: "var(--gold)",
              minWidth: 24,
              marginTop: 2,
            }}>
              {i + 1}.
            </span>
            <p style={{
              fontFamily: "var(--font-body-stack)",
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(247, 243, 236, 0.8)",
            }}>
              {q}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", maxWidth: 480, marginBottom: 32 }}>
        <p style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: 26,
          fontStyle: "italic",
          color: "var(--parchment)",
          lineHeight: 1.4,
          marginBottom: 36,
        }}>
          This conversation takes about 10 minutes.<br />
          <span style={{ color: "var(--gold-dark)" }}>It will set the tone for everything that follows.</span>
        </p>

        <a href={SERAFINA_URL} className="replay-cta" style={{ marginBottom: 16, display: "inline-block" }}>
          Begin Your Attunement with Serafina
        </a>

        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 12,
          color: "var(--ash)",
          marginTop: 20,
        }}>
          Full access to Serafina unlocks on Day 1 of the challenge.
        </p>
      </div>

      {/* Divider */}
      <div style={{
        width: "100%",
        maxWidth: 560,
        height: 1,
        background: "var(--ash-dark)",
        marginBottom: 48,
      }} />

      {/* Footer note */}
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 13,
          lineHeight: 1.7,
          color: "var(--ash)",
        }}>
          Questions before the challenge begins?<br />
          Reach us at{" "}
          <a href="mailto:goldenpath@aurealeaders.com" style={{ color: "var(--gold-dark)" }}>
            goldenpath@aurealeaders.com
          </a>
        </p>
      </div>

    </main>
  );
}

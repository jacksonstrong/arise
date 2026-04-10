import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ARISE Replay Access — All 7 Sessions | AUREA Leaders",
  description: "Get lifetime access to all 7 ARISE Challenge replay recordings for $7.",
};

const STRIPE_LINK = "https://buy.stripe.com/eVq14m3Ex5T1eH3glW53O1b";

const SESSIONS = [
  { day: "Day 1", title: "Identity Activation", description: "Access the felt sense of your highest self — not as a concept, but as a lived experience in your body." },
  { day: "Day 2", title: "Genius Statement", description: "Name the irreducible thing only you can offer. Somatic anchoring to lock it in." },
  { day: "Day 3", title: "Tribe Matching", description: "Meet your Human Design-matched pod of co-creators building work like yours." },
  { day: "Day 4", title: "Community Integration", description: "Deepen your pod connection and establish your support structure for the long game." },
  { day: "Day 5", title: "Offer Architecture", description: "Build your first offer live inside Serafina — named, structured, and priced." },
  { day: "Day 6", title: "Landing Page + Content", description: "Your landing page goes live. Your 30-day content plan takes shape." },
  { day: "Day 7", title: "Group Launch", description: "You launch. Live. In front of your pod and the full ARISE community." },
];

export default function ReplaysPage() {
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
      <div style={{ textAlign: "center", maxWidth: 640, marginBottom: 64 }}>
        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--gold)",
          marginBottom: 24,
        }}>
          AUREA Leaders · ARISE Challenge
        </p>
        <h1 style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: "clamp(42px, 6vw, 72px)",
          fontWeight: 300,
          color: "var(--parchment)",
          lineHeight: 1.1,
          marginBottom: 24,
        }}>
          Keep Every Session.<br />
          <em style={{ color: "var(--gold)" }}>Forever.</em>
        </h1>
        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 17,
          lineHeight: 1.7,
          color: "rgba(247, 243, 236, 0.75)",
          marginBottom: 40,
        }}>
          Seven days of live coaching, somatic work, offer-building, and a group launch — all recorded.
          Get lifetime access to every replay for <strong style={{ color: "var(--parchment)" }}>$7</strong>.
        </p>

        <a href={STRIPE_LINK} className="replay-cta">
          Get Replay Access — $7
        </a>

        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 12,
          color: "var(--ash)",
          marginTop: 16,
        }}>
          Replays delivered by email after the challenge concludes on April 27, 2026.
        </p>
      </div>

      {/* Divider */}
      <div style={{
        width: "100%",
        maxWidth: 640,
        height: 1,
        background: "var(--ash-dark)",
        marginBottom: 64,
      }} />

      {/* Session List */}
      <div style={{ width: "100%", maxWidth: 640, marginBottom: 64 }}>
        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--gold-dark)",
          marginBottom: 32,
          textAlign: "center",
        }}>
          What&rsquo;s Included
        </p>
        {SESSIONS.map((s) => (
          <div
            key={s.day}
            style={{
              display: "flex",
              gap: 24,
              marginBottom: 32,
              paddingBottom: 32,
              borderBottom: "1px solid var(--ash-dark)",
            }}
          >
            <div style={{ minWidth: 56 }}>
              <p style={{
                fontFamily: "var(--font-body-stack)",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--gold)",
              }}>
                {s.day}
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: "var(--font-heading-stack)",
                fontSize: 22,
                fontWeight: 400,
                color: "var(--parchment)",
                marginBottom: 6,
              }}>
                {s.title}
              </p>
              <p style={{
                fontFamily: "var(--font-body-stack)",
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(247, 243, 236, 0.65)",
              }}>
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: 28,
          fontStyle: "italic",
          color: "var(--parchment)",
          lineHeight: 1.4,
          marginBottom: 32,
        }}>
          &ldquo;The work doesn&rsquo;t end on Day 7.&rdquo;
        </p>
        <a href={STRIPE_LINK} className="replay-cta">
          Get Replay Access — $7
        </a>
        <p style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 12,
          color: "var(--ash)",
          marginTop: 16,
        }}>
          Questions? <a href="mailto:goldenpath@aurealeaders.com" style={{ color: "var(--gold-dark)" }}>goldenpath@aurealeaders.com</a>
        </p>
      </div>

    </main>
  );
}

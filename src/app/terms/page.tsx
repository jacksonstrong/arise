import Link from "next/link";

export default function TermsPage() {
  return (
    <main style={{ background: "var(--ink)", minHeight: "100vh", padding: "80px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", color: "var(--parchment)" }}>
        <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold-dark)", marginBottom: 24 }}>
          AUREA Leaders
        </p>
        <h1 style={{ fontFamily: "var(--font-heading-stack)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, marginBottom: 48, lineHeight: 1.2 }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: 13, color: "var(--ash)", marginBottom: 48 }}>Last updated: April 2026</p>

        {[
          ["Acceptance of Terms", "By registering for the ARISE Challenge or any AUREA Leaders program, you agree to these Terms of Service. If you do not agree, please do not register."],
          ["Program Access", "Registration grants you access to live sessions, recordings (where offered), and community spaces for the duration specified at registration. Access is personal and non-transferable."],
          ["Free Registration", "The ARISE Challenge is offered at no cost. Certain add-ons such as replay access may be offered separately at a stated price. All sales are final unless otherwise specified."],
          ["Recordings and Replays", "Replay access, where purchased, is granted for personal use only. You may not share, resell, or redistribute recordings in any form."],
          ["Code of Conduct", "Participants are expected to engage with respect, integrity, and genuine commitment to the work. AUREA Leaders reserves the right to remove any participant from the program for conduct that violates the spirit of the community."],
          ["Intellectual Property", "All content, meditations, frameworks, and materials provided through AUREA Leaders programs are the intellectual property of AUREA Leaders and may not be reproduced or distributed without written permission."],
          ["Disclaimer", "ARISE is an educational and transformational program. Results vary. Nothing in this program constitutes medical, legal, or financial advice."],
          ["Contact", "Questions about these Terms? Reach us at goldenpath@aurealeaders.com."],
        ].map(([heading, body]) => (
          <div key={heading as string} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-heading-stack)", fontSize: 22, fontWeight: 400, color: "var(--gold)", marginBottom: 12 }}>
              {heading}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(247, 243, 236, 0.8)" }}>{body}</p>
          </div>
        ))}

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--ash-dark)" }}>
          <Link href="/" style={{ color: "var(--gold-dark)", fontSize: 13, textDecoration: "none", letterSpacing: ".1em", textTransform: "uppercase" }}>
            &larr; Back to ARISE
          </Link>
        </div>
      </div>
    </main>
  );
}

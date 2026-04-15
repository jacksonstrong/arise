import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main style={{ background: "var(--ink)", minHeight: "100vh", padding: "80px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", color: "var(--parchment)" }}>
        <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold-dark)", marginBottom: 24 }}>
          AUREA Leaders
        </p>
        <h1 style={{ fontFamily: "var(--font-heading-stack)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, marginBottom: 48, lineHeight: 1.2 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: "var(--ash)", marginBottom: 48 }}>Last updated: April 2026</p>

        {[
          ["Information We Collect", "When you register for the ARISE Challenge or any AUREA Leaders program, we collect your name, email address, and phone number if provided. We may also collect information about how you interact with our website and communications."],
          ["How We Use Your Information", "We use your information to deliver the programs you register for, send you communications related to your registration, and occasionally share information about future offerings from AUREA Leaders. We do not sell your personal information to third parties."],
          ["Email Communications", "By registering, you agree to receive email and SMS communications related to ARISE and AUREA Leaders. You may unsubscribe at any time by clicking the unsubscribe link in any email or replying STOP to any SMS message."],
          ["Third-Party Services", "We use GoHighLevel for contact management and email delivery, and Stripe for payment processing. These services have their own privacy policies governing the use of your information."],
          ["Data Security", "We take reasonable measures to protect your personal information. However, no transmission over the internet is completely secure, and we cannot guarantee absolute security."],
          ["Your Rights", "You may request access to, correction of, or deletion of your personal information at any time by contacting us at goldenpath@aurealeaders.com."],
          ["Contact", "If you have questions about this Privacy Policy, please contact us at goldenpath@aurealeaders.com."],
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

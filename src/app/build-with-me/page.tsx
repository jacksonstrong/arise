"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BuildWithMeLetterPage() {
  const router = useRouter();

  return (
    <main style={{ background: "var(--ink)", minHeight: "100vh", color: "var(--parchment)" }}>
      <header style={{ padding: "40px 24px 0", textAlign: "center" }}>
        <Image src="/aurea-logo.png" alt="AUREA" width={88} height={68} priority style={{ opacity: 0.92 }} />
      </header>
      <section style={{ padding: "80px 24px 120px", maxWidth: 680, margin: "0 auto" }}>
        <p className="eyebrow" style={{
          textAlign: "center",
          marginBottom: 32,
          color: "var(--gold)",
          fontSize: 15,
          letterSpacing: "0.32em",
        }}>
          A Conversation, Not a Form
        </p>
        <h1 style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: "clamp(44px, 6.5vw, 72px)",
          fontWeight: 300,
          lineHeight: 1.1,
          marginBottom: 24,
          textAlign: "center",
          letterSpacing: "-0.015em",
        }}>
          Before we begin.
        </h1>

        {/* Ornament under title */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          maxWidth: 260,
          margin: "0 auto 64px",
        }} aria-hidden="true">
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--gold-dark))" }} />
          <div style={{ color: "var(--gold)", fontSize: 14 }}>&#10022;</div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--gold-dark), transparent)" }} />
        </div>

        <div style={{ fontSize: 18, lineHeight: 1.85, color: "rgba(247, 243, 236, 0.88)" }}>
          <p style={{ marginBottom: 24 }}>Thank you for being here.</p>
          <p style={{ marginBottom: 24 }}>I want to come back to you with something built for exactly what you need — not a repackaged program I already had planned. So before you answer what follows, I want to name a few things I hear often from the people I&rsquo;m lucky enough to work with. Not to assume it&rsquo;s you, but to let you know what&rsquo;s already in the room.</p>
          <p style={{ marginBottom: 24 }}>Many come to me having outgrown spiritual communities that stayed on the surface. They&rsquo;ve built things they&rsquo;re proud of and feel the loneliness of being the strong one, the healer, the one everyone leans on — while quietly wondering who they get to lean into.</p>
          <p style={{ marginBottom: 40 }}>Many have had real financial success and know they are under-leveraging their actual purpose. Many can feel the movement they&rsquo;re meant to bring but can&rsquo;t yet translate it into clear, magnetic offerings. Many are exhausted from doing it alone, and unsure how to scale without losing the integrity that made the work matter in the first place.</p>
          <p style={{ marginBottom: 40 }}>If any of that is true for you — or if none of it is and the truth is something else entirely — I want to hear it from you.</p>

          <p style={{ marginBottom: 40 }}>I&rsquo;ve been doing this work for nearly 10 years. Long enough to know the answers aren&rsquo;t inside my head. They&rsquo;re inside your life.</p>

          {/* Pull quote */}
          <blockquote style={{
            fontFamily: "var(--font-heading-stack)",
            fontStyle: "italic",
            fontSize: "clamp(22px, 3vw, 30px)",
            fontWeight: 300,
            color: "var(--gold-light)",
            lineHeight: 1.35,
            textAlign: "center",
            padding: "28px 20px",
            margin: "8px 0 40px",
            borderTop: "1px solid rgba(201, 168, 76, 0.25)",
            borderBottom: "1px solid rgba(201, 168, 76, 0.25)",
          }}>
            The more honest you are, the more precisely I can serve you.
          </blockquote>

          <p style={{ marginBottom: 24 }}>Every question on the pages that follow is here because I actually need your answer — not to decide if you qualify, but to shape what I come back to you with.</p>
          <p style={{ marginBottom: 24 }}>I read every word myself.</p>
          <p style={{ marginBottom: 48 }}>No timer. No wrong answers. No formula.</p>

          <p style={{
            fontFamily: "var(--font-heading-stack)",
            fontSize: 26,
            fontStyle: "italic",
            color: "var(--gold)",
            lineHeight: 1.5,
            textAlign: "center",
          }}>
            Love &amp; Strength,<br />
            Jackson
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 72 }}>
          <button
            type="button"
            onClick={() => router.push("/build-with-me/survey")}
            className="btn btn-large"
            style={{ boxShadow: "0 0 40px rgba(201, 168, 76, 0.08)" }}
          >
            Begin
          </button>
        </div>
      </section>
    </main>
  );
}

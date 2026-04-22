"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Calling = {
  opening: string;
  the_becoming: string;
  the_signal: string;
  the_calling: string;
  the_one_waiting: string;
  the_vessel: string;
  the_sealing: string;
};

const STORAGE_KEY = "before-we-build-submission";

export default function TheCallingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [calling, setCalling] = useState<Calling | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const raw = (() => {
      try {
        return sessionStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })();

    if (!raw) {
      router.replace("/before-we-build");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      router.replace("/before-we-build");
      return;
    }

    setPhase("loading");

    (async () => {
      try {
        const res = await fetch("/api/before-we-build/calling", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        });
        if (cancelled) return;
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "The oracle is resting." }));
          throw new Error(err.error || "The oracle is resting.");
        }
        const data = (await res.json()) as { calling: Calling };
        if (cancelled) return;
        setCalling(data.calling);
        setPhase("ready");
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(err instanceof Error ? err.message : "The oracle is resting.");
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main style={{ background: "var(--ink)", minHeight: "100vh", color: "var(--parchment)" }}>
      {phase === "loading" || phase === "idle" ? <LoadingState /> : null}
      {phase === "error" ? <ErrorState message={errorMsg} /> : null}
      {phase === "ready" && calling ? <CallingView calling={calling} /> : null}
    </main>
  );
}

function LoadingState() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        textAlign: "center",
      }}
    >
      <p
        className="eyebrow"
        style={{
          color: "var(--gold-dark)",
          marginBottom: 40,
          animation: "breathe 3.2s ease-in-out infinite",
        }}
      >
        The oracle is listening
      </p>
      <div style={{ color: "var(--gold)", fontSize: 28, animation: "breathe 3.2s ease-in-out infinite" }}>
        &#10022;
      </div>
      <p
        style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: "clamp(22px, 3vw, 28px)",
          fontStyle: "italic",
          color: "rgba(232, 213, 163, 0.78)",
          maxWidth: 520,
          marginTop: 40,
          lineHeight: 1.55,
        }}
      >
        Receiving what you brought through seven days.
      </p>
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

function ErrorState({ message }: { message: string | null }) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        textAlign: "center",
      }}
    >
      <p className="eyebrow" style={{ color: "var(--gold-dark)", marginBottom: 24 }}>
        A pause
      </p>
      <h1
        style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: "clamp(36px, 5vw, 52px)",
          fontWeight: 300,
          marginBottom: 24,
          letterSpacing: "-0.015em",
        }}
      >
        The oracle needs a breath.
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(247, 243, 236, 0.8)", maxWidth: 520, marginBottom: 40 }}>
        {message || "Something hesitated. Refresh this page to receive your Calling."}
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn"
      >
        Try again
      </button>
    </section>
  );
}

function Ornament() {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        maxWidth: 360,
        margin: "48px auto",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--gold-dark))" }} />
      <div style={{ color: "var(--gold)", fontSize: 16 }}>&#10022;</div>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--gold-dark), transparent)" }} />
    </div>
  );
}

function Movement({
  eyebrow,
  children,
  emphasis,
}: {
  eyebrow: string;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <section style={{ margin: "0 auto", maxWidth: 680, padding: "0 24px" }}>
      <p
        className="eyebrow"
        style={{
          color: "var(--gold-dark)",
          textAlign: "center",
          marginBottom: 28,
          letterSpacing: "0.32em",
        }}
      >
        {eyebrow}
      </p>
      <div
        style={{
          fontFamily: emphasis ? "var(--font-heading-stack)" : "var(--font-body-stack)",
          fontSize: emphasis ? "clamp(22px, 3vw, 28px)" : 19,
          fontStyle: emphasis ? "italic" : "normal",
          fontWeight: emphasis ? 300 : 300,
          lineHeight: 1.7,
          color: emphasis ? "var(--gold-light)" : "rgba(247, 243, 236, 0.92)",
          textAlign: emphasis ? "center" : "left",
          letterSpacing: emphasis ? "-0.005em" : "normal",
        }}
      >
        {children}
      </div>
    </section>
  );
}

function CallingView({ calling }: { calling: Calling }) {
  return (
    <>
      {/* HEADER */}
      <section
        style={{
          padding: "120px 24px 40px",
          maxWidth: 680,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p className="eyebrow" style={{ color: "var(--gold-dark)", marginBottom: 28 }}>
          A transmission received · After ARISE
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading-stack)",
            fontSize: "clamp(64px, 10vw, 120px)",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            marginBottom: 32,
          }}
        >
          The Calling
        </h1>
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            maxWidth: 260,
            margin: "0 auto 40px",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--gold-dark))" }} />
          <div style={{ color: "var(--gold)", fontSize: 14 }}>&#10022;</div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--gold-dark), transparent)" }} />
        </div>
        <p
          style={{
            fontFamily: "var(--font-heading-stack)",
            fontStyle: "italic",
            fontSize: "clamp(22px, 3vw, 28px)",
            color: "var(--gold-light)",
            lineHeight: 1.55,
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          {calling.opening}
        </p>
      </section>

      <Ornament />

      <Movement eyebrow="The Becoming">{calling.the_becoming}</Movement>
      <Ornament />

      <Movement eyebrow="The Signal">{calling.the_signal}</Movement>
      <Ornament />

      <Movement eyebrow="The Calling" emphasis>
        {calling.the_calling}
      </Movement>
      <Ornament />

      <Movement eyebrow="The One Waiting">{calling.the_one_waiting}</Movement>
      <Ornament />

      <Movement eyebrow="The Vessel">{calling.the_vessel}</Movement>
      <Ornament />

      <Movement eyebrow="The Sealing" emphasis>
        {calling.the_sealing}
      </Movement>

      {/* SIGN-OFF */}
      <section
        style={{
          padding: "80px 24px 160px",
          maxWidth: 680,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            maxWidth: 420,
            margin: "24px auto 56px",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--gold-dark))" }} />
          <div style={{ color: "var(--gold)", fontSize: 20 }}>&#10022;</div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--gold-dark), transparent)" }} />
        </div>
        <p
          style={{
            fontFamily: "var(--font-heading-stack)",
            fontSize: 26,
            fontStyle: "italic",
            color: "var(--gold)",
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          Love &amp; Strength,
          <br />
          Jackson
        </p>
        <p style={{ fontSize: 13, color: "var(--ash)", marginTop: 48, letterSpacing: "0.08em" }}>
          Screenshot this. Return to it often.
        </p>
      </section>
    </>
  );
}

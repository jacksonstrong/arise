"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import Image from "next/image";

function RegistrationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Focus trap and Escape key
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setName("");
        setEmail("");
        setPhone("");
        setStatus("idle");
        setErrorMsg("");
      }, 300);
      // Restore focus to previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
      return;
    }

    // Save currently focused element and lock body scroll
    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    // Focus the modal after it opens
    const timer = setTimeout(() => {
      const firstInput = modalRef.current?.querySelector<HTMLElement>(
        "input, button:not(.modal-close)"
      );
      firstInput?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" ref={modalRef}>
        <button className="modal-close" onClick={onClose} aria-label="Close registration form">
          &times;
        </button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h3
              id="modal-title"
              style={{
                fontFamily: "var(--font-heading-stack)",
                fontWeight: 300,
                fontSize: 28,
                color: "var(--gold)",
                marginBottom: 12,
              }}
            >
              You&rsquo;re In.
            </h3>
            <p
              style={{
                color: "var(--ash)",
                fontSize: 15,
                marginBottom: 8,
              }}
            >
              Welcome to ARISE. Check your email for details.
            </p>
            <p
              style={{
                fontFamily: "var(--font-heading-stack)",
                fontStyle: "italic",
                color: "var(--gold-dark)",
                fontSize: 16,
                marginTop: 20,
              }}
            >
              &ldquo;The hero inside you is not waiting for the fear to pass.
              They are waiting for you to move anyway.&rdquo;
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 id="modal-title">Join the ARISE Challenge</h3>
            <p className="modal-sub">
              7 days. Free. Live coaching. First access to Seraph.
            </p>
            <label htmlFor="reg-name" className="sr-only">Full name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="reg-email" className="sr-only">Email address</label>
            <input
              id="reg-email"
              type="email"
              placeholder="Your best email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="reg-phone" className="sr-only">Phone number (optional)</label>
            <input
              id="reg-phone"
              type="tel"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-large"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "Securing Your Spot..."
                : "Yes, I\u2019m Ready"}
            </button>
            {status === "error" && <p className="error-msg" role="alert">{errorMsg}</p>}
            <p
              style={{
                fontSize: 12,
                color: "var(--ash)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              Starts Monday, April 21, 2026 &middot; Zero cost, full commitment
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const answerId = `faq-answer-${question.slice(0, 20).replace(/\W/g, "")}`;
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button
        className="faq-q"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={answerId}
      >
        <span>{question}</span>
        <span className="toggle" aria-hidden="true">+</span>
      </button>
      <div className="faq-a" id={answerId} role="region" aria-hidden={!open}>{answer}</div>
    </div>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger children with [data-stagger] attribute
            const staggerChildren = entry.target.querySelectorAll("[data-stagger]");
            if (staggerChildren.length > 0) {
              staggerChildren.forEach((child, i) => {
                (child as HTMLElement).style.transitionDelay = `${i * 120}ms`;
                child.classList.add("visible");
              });
            }
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-scale, .gold-divider").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <RegistrationModal isOpen={modalOpen} onClose={closeModal} />

      <main>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div style={{ marginBottom: 16 }}>
          <Image src="/aurea-logo.png" alt="AUREA" width={156} height={120} priority />
        </div>
        <p className="eyebrow">
          Join the 7-Day ARISE Breakthrough &middot; Launching Monday, April 21, 2026
        </p>

        <div
          className="hero-grid-50"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            alignItems: "start",
            maxWidth: 1080,
            width: "100%",
            margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "left", display: "flex", alignItems: "stretch" }}>
            <h1 style={{ textAlign: "left", fontSize: "clamp(30px, 3.5vw, 48px)", margin: 0 }}>
              You Have The Gifts, But You Don&rsquo;t Yet Have The Identity, AI Systems, or Tribe That Matches Their Value&hellip;
              <br />
              <em>That Changes in 7 Days.</em>
            </h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "56.25%",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid var(--ash-dark)",
              }}
            >
              <iframe
                src="https://player.vimeo.com/video/1011664596?h=0&autoplay=1&muted=1&title=0&byline=0&portrait=0"
                title="ARISE 7-Day Challenge introduction video"
                loading="lazy"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--ash)",
                textTransform: "uppercase",
                letterSpacing: ".15em",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Watch &amp; Join the Challenge
            </p>
          </div>
        </div>

        <p
          className="arena-line"
          style={{ maxWidth: 1060, fontSize: 27, lineHeight: 1.65, margin: "16px auto 20px", padding: "0 20px" }}
        >
          Embody your Highest Frequency. Run an AI engine that builds your offers, your content, and your systems while you sleep. Build with a tribe of leaders who make your next level feel inevitable.
        </p>
        <div style={{ margin: "0 0 12px" }}>
          <button onClick={openModal} className="btn btn-large">
            Build What My Gift Deserves &mdash; Free
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)" aria-hidden="true">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--ash)", letterSpacing: ".05em" }}>
            5.0 on Google &middot; Trusted by 1,000+ coaches and entrepreneurs
          </p>
        </div>

        {/* What You Get Snapshot */}
        <div style={{ margin: "0 auto 16px", maxWidth: 820, width: "100%" }}>
          <p
            style={{
              fontSize: 22,
              textTransform: "uppercase",
              letterSpacing: ".22em",
              color: "var(--gold-dark)",
              marginTop: 40,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            In 7 Days, You Will Have
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {[
              { icon: "\u2666", title: "A Nervous System", subtitle: "That Scales", desc: "Feel your next-level self in your body" },
              { icon: "\u2699", title: "An AI Business", subtitle: "Engine", desc: "This goes way beyond ChatGPT." },
              { icon: "\u2726", title: "A Tribe That", subtitle: "Elevates You", desc: "People who make staying small impossible" },
            ].map((item, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  flex: 1,
                  minWidth: 240,
                  maxWidth: 280,
                  border: "1px solid var(--gold-dark)",
                  borderRadius: 4,
                  padding: "32px 24px",
                  textAlign: "center",
                  background: "linear-gradient(180deg, rgba(201, 168, 76, 0.06) 0%, rgba(201, 168, 76, 0) 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  color: "var(--gold)",
                  fontSize: 28,
                  marginBottom: 14,
                  filter: "drop-shadow(0 0 8px rgba(201, 168, 76, 0.4))",
                }}>{item.icon}</div>
                <p
                  style={{
                    fontFamily: "var(--font-heading-stack)",
                    fontSize: 22,
                    fontWeight: 400,
                    color: "var(--gold-light)",
                    lineHeight: 1.3,
                    margin: "0 0 10px",
                  }}
                >
                  {item.title}
                  <br />
                  {item.subtitle}
                </p>
                <p style={{
                  fontSize: 17,
                  color: "var(--ash)",
                  lineHeight: 1.5,
                  margin: 0,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ticker */}
        <div className="ticker-wrap">
          <div className="ticker">
            {[
              ["\u201cTHIS is the community I\u2019ve been searching for over the last decade.\u201d", "Michelle Hori, Executive Coach"],
              ["\u201cIt has renewed my vision and resolve around expanding my endeavors.\u201d", "Anamaria Aristizabal, Master Coach & Author"],
              ["\u201cIf you do the work, you will get the results.\u201d", "Fernando Subirats, Founder, The Manifestival"],
              ["\u201cTHIS is the community I\u2019ve been searching for over the last decade.\u201d", "Michelle Hori, Executive Coach"],
              ["\u201cIt has renewed my vision and resolve around expanding my endeavors.\u201d", "Anamaria Aristizabal, Master Coach & Author"],
              ["\u201cIf you do the work, you will get the results.\u201d", "Fernando Subirats, Founder, The Manifestival"],
            ].map(([quote, name], i) => (
              <span key={i} className="ticker-item" aria-hidden={i >= 3 ? "true" : undefined}>
                {quote} &mdash; <span className="name">{name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== THREE BLOCKS ===== */}
      <section className="blocks section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow text-center" style={{ fontSize: 22 }}>What&rsquo;s Actually In Your Way</p>
          <h2 className="blocks-heading">
            Three Blocks Between You
            <br />
            and Your Mission at Full Volume
          </h2>
          <p className="blocks-sub">
            Every course you&rsquo;ve taken tried to solve one of these. ARISE addresses all three
            &mdash; in 7 days, together, in the right order.
          </p>

          <div className="blocks-grid">
            <div className="block-card fade-in" data-stagger>
              <div className="block-num">Block One</div>
              <h3>Frequency</h3>
              <p>
                Most creators on the verge of a breakthrough know intellectually that they&rsquo;re
                gifted. But often cannot consistently access the feeling of your greatness. Without
                that felt sense alive in your body, every offer you build, every piece of content you
                create, every price you set comes from a state of contraction &mdash; not your
                sovereign power. The strategy won&rsquo;t work until the frequency is right. We start
                here, in a group, and embed your greatness into your field.
              </p>
            </div>
            <div className="block-card fade-in" data-stagger>
              <div className="block-num">Block Two</div>
              <h3>Tribe</h3>
              <p>
                Do you feel like you&rsquo;re building alone? If so, somewhere in your nervous system
                lives a primal fear holding you back. Too often it whispers, &ldquo;If you fully
                express yourself and speak your truth, you will be abandoned. Persecuted for being
                different. Abandoned by the people you love.&rdquo; This fear keeps you beneath your
                potential. It only dissolves in the presence of co-creators who see your
                fire &mdash; and match it. You need a tribe that makes expansion feel safe.
              </p>
            </div>
            <div className="block-card fade-in" data-stagger>
              <div className="block-num">Block Three</div>
              <h3>Strategy</h3>
              <p>
                Vision without a plan stays a dream. You have the gift, but without a clear path
                from where you are to where you&rsquo;re meant to be, even the most powerful
                calling stalls out. Most strategy out there was designed for people selling
                products &mdash; not for leaders carrying a message. In this challenge, we give you
                a real roadmap: a validated offer, a living landing page, content in the world, and
                a 30-day plan to your first $10,000 &mdash; all built from your truth, not someone
                else&rsquo;s template.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ===== TRANSITION BRIDGE ===== */}
      <div style={{
        position: "relative",
        padding: "80px 24px",
        background: "linear-gradient(180deg, var(--black) 0%, var(--ink) 100%)",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Radial glow */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(201, 168, 76, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Gold divider with diamond */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          maxWidth: 400,
          margin: "0 auto 40px",
          position: "relative",
        }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--gold-dark))" }} />
          <div style={{ color: "var(--gold)", fontSize: 16 }}>&#10022;</div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--gold-dark), transparent)" }} />
        </div>
        {/* Pull quote */}
        <p className="fade-in" style={{
          fontFamily: "var(--font-heading-stack)",
          fontStyle: "italic",
          fontSize: "clamp(22px, 3vw, 32px)",
          fontWeight: 300,
          color: "var(--gold-light)",
          maxWidth: 700,
          margin: "0 auto 40px",
          lineHeight: 1.5,
          position: "relative",
        }}>
          Gifted leaders stay stuck not because they lack talent &mdash; but because they lack the infrastructure and identity to hold what&rsquo;s next.
        </p>
        {/* Bottom gold divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          maxWidth: 400,
          margin: "0 auto",
          position: "relative",
        }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--gold-dark))" }} />
          <div style={{ color: "var(--gold)", fontSize: 16 }}>&#10022;</div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--gold-dark), transparent)" }} />
        </div>
      </div>

      {/* ===== PROBLEM ===== */}
      <section className="problem section-pad fade-in" style={{ position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 800,
          background: "radial-gradient(circle, rgba(201, 168, 76, 0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div className="content" style={{ position: "relative" }}>
          <p style={{
            fontFamily: "var(--font-body-stack)",
            fontSize: 22,
            fontWeight: 400,
            color: "var(--gold-dark)",
            textAlign: "center",
            lineHeight: 1.4,
            textTransform: "uppercase",
            letterSpacing: ".22em",
            marginBottom: 40,
          }}>
            You can feel it &mdash; something massive is trying to come through you
          </p>
          <div className="lines">
            But you&rsquo;ve hit a ceiling &mdash; and you know it.
            <br /><br />
            You&rsquo;ve <em>outgrown</em> the version of yourself that got you here.
            <br />
            The identity that carried you this far <strong>can&rsquo;t carry you to what&rsquo;s next</strong>.
            <br /><br />
            Your nervous system isn&rsquo;t calibrated for the level you&rsquo;re stepping into.
            <br />
            Your systems aren&rsquo;t yet built to scale &mdash; so you consciously or subconsciously play small.
            <br />
            And most of the people around you &mdash; as much as they love you
            or doubt you &mdash; cannot get you where you&rsquo;re meant to go.
            <br /><br />
            So you keep striving. Keep pressing on. Keep showing up doing what <strong>USED TO</strong> work.
            What <strong>USED TO</strong> feel safe. Being who you <strong>USED TO</strong> be.
            <br />
            But the <strong>growth has plateaued</strong>.
            <br />
            The money isn&rsquo;t enough.
            <br />
            Or if it is, you don&rsquo;t <em>FEEL</em> like it&rsquo;s enough.
            <br />
            And you know it&rsquo;s not a talent problem.
            <br /><br />
            It&rsquo;s an <strong>infrastructure and identity</strong> problem.
            <br /><br />
            And here&rsquo;s the kicker &mdash; we all see that the world is being shaken to its core,
            and your people don&rsquo;t need you &ldquo;someday.&rdquo;
            <br />
            They need you <em>now</em>. Fully operational.
            <br />
            At a level you haven&rsquo;t given yourself permission to reach yet.
            <br /><br />
            <strong>Every day you stay here in the status quo is a day someone who needed your medicine&hellip; didn&rsquo;t find it.</strong>
            <br /><br />
            You don&rsquo;t need more inspiration.
            <br />
            You don&rsquo;t need another course.
            <br />
            You don&rsquo;t need to start over.
            <br /><br />
            <strong>You need to feel your next-level self in your body.</strong>
            <br />
            <strong>You need to know WTF to do with AI before you get left in the dust or burnout trying to hold 1,000 things solo.</strong>
            <br />
            <strong>You need to surround yourself with people who make your subconscious feel safe to shine so that staying small is impossible.</strong>
          </div>

          <div className="gold-divider" />
          <button onClick={openModal} className="btn">
            Build What My Gift Deserves &mdash; Free
          </button>
        </div>
      </section>

      {/* ===== GUIDE ===== */}
      <section className="guide section-pad">
        <div className="container-wide">
          <p className="eyebrow text-center" style={{ fontSize: 22 }}>Your Guide</p>
          <div className="guide-grid">
            <Image src="/jackson-headshot.jpg" alt="Jackson Strong" width={397} height={389} className="guide-photo fade-in-left" style={{ objectFit: "cover" }} />
            <div className="guide-text fade-in">
              <h2>Jackson Strong</h2>
              <p className="title-sub">
                Founder of AUREA Leaders &middot; Creator of Stage Secrets
              </p>
              <p>
                My career began in high-tech private equity and the startup world. I worked for
                multiple companies valued over $300M. I was good at it.
              </p>
              <p>But I was dying in the matrix.</p>
              <p>
                In 2016, the tension between my corporate life and my soul&rsquo;s work snapped. I
                had a legitimate nervous breakdown. I got divorced, quit the corporate life, and
                founded my first company serving purpose-driven entrepreneurs.
              </p>
              <p>
                Since then, I&rsquo;ve generated over $600,000 helping transformational leaders find
                their message, build their offer, and monetize their mission. I&rsquo;ve spent 10,000+
                hours in the room with people just like you.
              </p>
              <div className="vulnerability">
                <p>
                  I need to tell you something that people in my position aren&rsquo;t supposed to
                  say: this past year has been one of the hardest of my life. I have felt the same
                  fear, the same contraction, the same voice whispering &ldquo;who are you to do
                  this&rdquo; that I know you&rsquo;re feeling right now.
                </p>
              </div>
              <p>But the hardest year of my life was also the deepest work I&rsquo;ve ever done.</p>
              <p>
                I went into seclusion in the forests of East Texas. I sat with deep medicines. I
                consulted with guides and allies I trust with my life. I confronted every shadow that
                has been holding me back &mdash; not to bypass it, not to transcend it, but to{" "}
                <em>alchemize</em> it.
              </p>
              <p>
                ARISE is what I found at the bottom. The bone broth. The most concentrated, distilled
                essence of everything I&rsquo;ve heard, everything I&rsquo;ve lived, and everything I
                know works. Seven days. Three blocks. No filler.
              </p>
              <p>
                And we&rsquo;re not done listening. During ARISE, your feedback directly shapes what
                we build next.
              </p>
              <p>
                I&rsquo;m not here as a guru. I&rsquo;m here as a builder who went into the fire
                &mdash; mine and yours &mdash; and came back with something real. Not from a
                mountaintop. From the arena. And the arena is still where I live.
              </p>
            </div>
          </div>

          <div className="testimonials-row fade-in">
            <div className="test-card fade-in" data-stagger>
              <p className="quote">
                &ldquo;Jackson&rsquo;s guidance has been nothing short of transformative. His unique
                blend of expertise and compassion empowered me to step into my true potential.&rdquo;
              </p>
              <p className="attr">&mdash; Lakia Meadan</p>
              <p className="attr-org">Sacred Earth Travels</p>
            </div>
            <div className="test-card fade-in" data-stagger>
              <p className="quote">
                &ldquo;It&rsquo;s truly a deep dive into your soul&rsquo;s purpose. Being in a group
                container with Jackson and other vibrant souls is so expansive. 11 out of 10!&rdquo;
              </p>
              <p className="attr">&mdash; Daniela Sardi &amp; Tyler Schraeder</p>
              <p className="attr-org">Stage Secrets Alumni</p>
            </div>
            <div className="test-card fade-in" data-stagger>
              <p className="quote">
                &ldquo;Jackson knows how to bring your authenticity to life and break through the
                blocks to speaking your truth.&rdquo;
              </p>
              <p className="attr">&mdash; Kim Kong</p>
              <p className="attr-org">Founder, Movement University</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7-DAY JOURNEY ===== */}
      <section className="journey section-pad">
        <div className="container-wide">
          <p className="eyebrow text-center" style={{ fontSize: 22 }}>The 7-Day Journey</p>
          <p style={{ fontSize: 13, letterSpacing: ".06em", color: "var(--ash)", textAlign: "center", marginBottom: 24 }}>
            Live Coaching &middot; Daily Somatic Meditations &middot; First Access to{" "}
            <strong style={{ color: "var(--gold)" }}>Seraph</strong> &mdash; the AI Platform Built
            for Transformation Leaders
          </p>
          <h2>
            Simple Enough to Follow.
            <br />
            Powerful Enough to Change Everything.
          </h2>
          <p className="sub">
            Each day includes a live call, a guided somatic meditation, and one clear action. No
            overwhelm. No busywork. Just the moves that matter.
          </p>
          <p className="identity-line">
            This is not a business challenge. This is an identity activation with a business built on
            top of it &mdash; powered by technology that was built for your kind of mind.
          </p>

          <div className="phase-label">Phase 1 &mdash; Frequency</div>

          {[
            { num: "1", title: "Find Your Frequency", text: "Before strategy, before offers \u2014 you must access the feeling of your own greatness. Not the intellectual knowing. The felt sense. Through a guided somatic meditation, we drop below the noise and make contact with who you actually are." },
            { num: "2", title: "Name Your Genius", text: "Your ideal client is a mirror of who you used to be. Today you build an emotionally vivid portrait of the exact human you serve. You will distill your transformation into a genius statement so clear a stranger can feel it in one sentence." },
            { num: "3", title: "Claim Your Identity", text: "The version of you that builds this mission is not the version of you that has been waiting. Today you cross the threshold. You will write 5 present-tense identity declarations and anchor them in your body through a guided somatic process." },
          ].map((day) => (
            <div key={day.num} className="day-card fade-in">
              <div className="day-num">{day.num}</div>
              <div className="day-content">
                <h3>{day.title}</h3>
                <p>{day.text}</p>
              </div>
            </div>
          ))}

          <div className="phase-label">Phase 2 &mdash; Tribe</div>

          <div className="day-card fade-in">
            <div className="day-num">4</div>
            <div className="day-content">
              <h3>Meet Your Builders</h3>
              <p>
                Today you stop building alone. You will be matched into a co-creator pod &mdash; a
                small group of leaders at your level, with your fire. That primal fear that if you
                fully become who you are, you will be ostracized? It only dissolves in the presence
                of people who <span className="highlight">see your fire and match it</span>.
              </p>
            </div>
          </div>

          <div className="phase-label">Phase 3 &mdash; Technology</div>

          <div className="day-card fade-in">
            <div className="day-num">5</div>
            <div className="day-content">
              <h3>Build Your Offer &mdash; With Seraph</h3>
              <p>
                Your gifts become a structure: a name, a promise, a price, a format. Today you step
                into <strong style={{ color: "var(--gold-light)" }}>Seraph</strong> for the first
                time &mdash; and experience what it feels like to build with AI that understands
                sacred work.
              </p>
              <div className="seraph-tease">
                <p>
                  This is the day you experience the Pathfinder Panel, Serafina, and the
                  offer-building tools &mdash; and realize why nothing else on the market was built
                  for you.
                </p>
              </div>
            </div>
          </div>

          <div className="day-card fade-in">
            <div className="day-num">6</div>
            <div className="day-content">
              <h3>Find Your Voice + Regulate to Receive</h3>
              <p>
                Morning: you press record and speak your truth to a real audience. Afternoon: you
                learn the science of why your throat tightens when you think about charging.{" "}
                <span className="highlight">
                  This is the session that makes everything else stick.
                </span>
              </p>
            </div>
          </div>

          <div className="phase-label">Convergence</div>

          <div className="day-card fade-in">
            <div className="day-num">7</div>
            <div className="day-content">
              <h3>ARISE</h3>
              <p>
                Your frequency. Your tribe. Your technology. Today they converge. You launch with
                your pod &mdash; your offer live, your voice in the world, your nervous system
                regulated to hold what&rsquo;s coming. You are no longer preparing. You are building.
                And the people who need you can finally find you.
              </p>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: 48 }}>
            <button onClick={openModal} className="btn">
              Build What My Gift Deserves &mdash; Free
            </button>
          </div>
        </div>
      </section>

      {/* ===== SERAPH SECTION ===== */}
      <section className="seraph section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow text-center" style={{ fontSize: 22, color: "var(--gold)" }}>
            Introducing Seraph
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading-stack)",
              fontWeight: 300,
              fontSize: "clamp(32px, 5vw, 52px)",
              textAlign: "center",
              marginBottom: 12,
              lineHeight: 1.25,
            }}
          >
            The World&rsquo;s First Sovereign Operating System
            <br />
            for Transformation Leaders
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "var(--ash)",
              maxWidth: 620,
              margin: "0 auto 20px",
              fontSize: 17,
              lineHeight: 1.7,
            }}
          >
            Every tool on the market was built for marketers. Seraph was built for <em>you</em>.
          </p>
          <p
            style={{
              textAlign: "center",
              fontFamily: "var(--font-heading-stack)",
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--gold-dark)",
              marginBottom: 56,
            }}
          >
            During ARISE, you experience it first. Your feedback shapes what it becomes.
          </p>

          {/* Seraph Video */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 720,
              margin: "0 auto 56px",
              paddingBottom: "40.5%",
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid var(--ash-dark)",
              background: "var(--ash-dark)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "2px solid var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(201, 168, 76, 0.1)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--gold)">
                  <polygon points="8,5 19,12 8,19" />
                </svg>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--ash)",
                  textTransform: "uppercase",
                  letterSpacing: ".15em",
                }}
              >
                Seraph Video Coming Soon
              </p>
            </div>
          </div>

          <div
            className="seraph-features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            {[
              { icon: "\u263C", title: "Sacred Alarm", desc: "A personalized morning activation \u2014 somatic, strategic, and calibrated to your nervous system state." },
              { icon: "\u2756", title: "Serafina \u2014 Your AI Guide", desc: "A soul-aligned AI intelligence that knows your journey stage and builds your offers with warmth." },
              { icon: "\u2666", title: "HD Penta Tribe Matching", desc: "Matched into a co-creator pod based on your Human Design profile \u2014 not demographics." },
              { icon: "\u2699", title: "Pathfinder Panel", desc: "Your daily command center \u2014 identity, offers, content, tribe, and progress in one screen." },
              { icon: "\u25B2", title: "Gain Tracker", desc: "Retrain your brain to measure forward from where you started, not backward from where you\u2019re going." },
              { icon: "\u2605", title: "The Leader\u2019s Journey", desc: "A 12-month Hero\u2019s Journey curriculum with stage gates, sacred quests, and progression." },
            ].map((item, i) => (
              <div
                key={i}
                className="feature-card-hover fade-in"
                data-stagger
                style={{
                  border: "1px solid var(--ash-dark)",
                  borderRadius: 2,
                  padding: "32px 24px",
                }}
              >
                <p style={{ fontSize: 24, marginBottom: 12 }}>{item.icon}</p>
                <h4
                  style={{
                    fontFamily: "var(--font-heading-stack)",
                    fontWeight: 400,
                    fontSize: 20,
                    color: "var(--gold-light)",
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ fontSize: 14, color: "var(--ash)", lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 680, margin: "56px auto 0", textAlign: "center" }}>
            <div
              style={{
                border: "1px solid var(--gold-dark)",
                borderRadius: 2,
                padding: "36px 32px",
                background: "rgba(201, 168, 76, 0.03)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-heading-stack)",
                  fontSize: 22,
                  fontWeight: 300,
                  color: "var(--parchment)",
                  marginBottom: 12,
                  lineHeight: 1.4,
                }}
              >
                Nothing like this exists. We checked.
              </p>
              <p style={{ color: "var(--ash)", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                Seraph is not another CRM with a chatbot bolted on. It is a sovereign operating
                system for identity, nervous system regulation, and wealth transformation.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-heading-stack)",
                  fontStyle: "italic",
                  fontSize: 18,
                  color: "var(--gold)",
                }}
              >
                ARISE participants are co-creators, not customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUTCOMES ===== */}
      <section className="outcomes section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow text-center" style={{ fontSize: 22 }}>In 7 Days, You Will Have...</p>
          <div className="outcomes-grid">
            {[
              ["Your Frequency", "The felt sense of your highest self \u2014 activated in your body, not just your mind."],
              ["Your Genius Statement", "The 1-2 sentence distillation of the transformation only you can deliver."],
              ["Your Co-Creator Pod", "A matched tribe of builders at your level \u2014 people who see your fire and refuse to let you shrink."],
              ["Your Identity Declarations", "5 present-tense statements about who you are becoming \u2014 anchored somatically."],
              ["Your First Offer + Landing Page", "Named, priced, structured, and LIVE \u2014 built inside Seraph with Serafina guiding the process."],
              ["Your First Piece of Content", "Something real, shared with a real audience. The ice is broken forever."],
              ["Your Regulation Practice", "A nervous system protocol for YOUR wiring \u2014 so you can hold the wealth, visibility, and impact that\u2019s coming."],
              ["Hands-On Seraph Experience", "You will have used the platform no one else has seen \u2014 and your feedback will shape its future."],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="outcome-card fade-in"
                data-stagger
                style={i === 7 ? { borderColor: "var(--gold-dark)" } : undefined}
              >
                <div className="symbol">&#10022;</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ALCHEMY ===== */}
      <section className="section-pad fade-in" style={{ background: "var(--ink)" }}>
        <div className="container">
          <p className="eyebrow text-center" style={{ fontSize: 22 }}>The Alchemy</p>
          <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading-stack)",
                fontWeight: 300,
                fontSize: "clamp(26px, 4vw, 38px)",
                lineHeight: 1.3,
                marginBottom: 32,
              }}
            >
              Whatever Is Holding You Back
              <br />
              Is What You&rsquo;re Meant to Utilize.
            </h2>
            <p style={{ color: "var(--ash)", marginBottom: 24 }}>
              Your wounds are not obstacles to your mission. They ARE the mission. The pain
              you&rsquo;ve walked through is the exact credential your future clients need.
            </p>
            <div
              style={{
                borderLeft: "2px solid var(--gold-dark)",
                paddingLeft: 20,
                margin: "40px auto",
                maxWidth: 540,
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-heading-stack)",
                  fontStyle: "italic",
                  fontSize: 20,
                  color: "var(--gold-light)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                The ancient Greeks called her Ananke &mdash; the Goddess of Necessity. She is the
                force that makes heroism unavoidable.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-heading-stack)",
                  fontStyle: "italic",
                  fontSize: 20,
                  color: "var(--gold-light)",
                  lineHeight: 1.6,
                }}
              >
                You feel her. That is not restlessness. That is Necessity herself, telling you it is
                time.
              </p>
            </div>
            <p
              style={{
                fontFamily: "var(--font-heading-stack)",
                fontSize: 22,
                color: "var(--gold)",
                fontWeight: 300,
              }}
            >
              This is not a self-improvement challenge.
              <br />
              This is a Hero&rsquo;s Journey &mdash; compressed into 7 days.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHO THIS IS FOR ===== */}
      <section className="who section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow text-center" style={{ fontSize: 22 }}>Is This For You?</p>
          <div className="who-grid">
            <div className="who-col yes fade-in" data-stagger>
              <h3>This Is For You If:</h3>
              <ul>
                {[
                  "You\u2019ve done deep inner work and you\u2019re ready to translate it into income",
                  "You know you\u2019re meant to lead but don\u2019t have a clear offer yet",
                  "You\u2019re a coach, healer, speaker, or thought leader \u2014 not a hobbyist",
                  "You crave a community of equals, not another course with no container",
                  "You want to experience AI built for transformation leaders \u2014 not marketers",
                  "You\u2019re willing to be seen, even when it\u2019s uncomfortable",
                  "You want structure that meets your soul \u2014 not one or the other",
                  "You are done waiting for permission to build",
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="who-col no fade-in" data-stagger>
              <h3>This Is Not For You If:</h3>
              <ul>
                {[
                  "You\u2019re looking for a passive, watch-the-replays experience",
                  "You want someone to do the work for you",
                  "You\u2019re not willing to show up live and engage",
                  "You think marketing and money are \u201cunspiritual\u201d",
                  "You\u2019re in active crisis and need clinical support, not a challenge",
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STAKES ===== */}
      <section className="stakes section-pad fade-in">
        <div className="container">
          <div className="stakes-dont">
            <h3>Here Is What Happens If You Don&rsquo;t</h3>
            <p>
              Another season passes. The gifts stay inside. The people who need your transformation
              never find you. The Goddess of Necessity keeps burning. And the hero inside you waits
              another season for you to stop asking for permission and start answering the call.
            </p>
          </div>
          <div className="gold-divider" />
          <div className="stakes-do">
            <h3>Here Is What Happens If You Do</h3>
            <p>
              In 7 days, you have accessed the frequency of your highest self. You have a genius
              statement, a co-creator pod, an identity anchored in your body, a real offer with a
              live landing page, content in the world, and a regulated nervous system.
            </p>
            <p>
              You are no longer preparing.
              <br />
              You are no longer waiting.
              <br />
              You are building.
            </p>
            <p className="closer">
              The fear, the shadows, the darkness &mdash; were never the enemy. They were the forge.
              And you just walked through it.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq section-pad">
        <div className="container">
          <p className="eyebrow text-center">Questions</p>
          <FaqItem
            question="What time are the live calls?"
            answer="[TIME + TIMEZONE]. All calls are recorded, but the magic happens live. Show up if you can."
          />
          <FaqItem
            question="Is this really free?"
            answer="Yes. No credit card. No hidden upsell wall. You will be invited to continue the journey with AUREA Leaders at the end, but the 7 days are complete on their own."
          />
          <FaqItem
            question="Is Jackson going to try to sell me something?"
            answer="Yes \u2014 and I\u2019m going to be transparent about it. On Day 7, you\u2019ll be invited to continue inside AUREA Builders. But the challenge delivers standalone value. I\u2019d rather you trust me and say no than feel manipulated and say yes."
          />
          <FaqItem
            question="What is Seraph?"
            answer="Seraph is the world\u2019s first sovereign operating system for transformation leaders. During ARISE, you experience it firsthand \u2014 and your feedback directly shapes what it becomes."
          />
          <FaqItem
            question="I'm not sure I'm &quot;ready&quot; \u2014 should I wait?"
            answer="The people who feel least ready are the ones this was built for. You don\u2019t need to have it figured out. You need to start."
          />
          <FaqItem
            question="What if I miss a day?"
            answer="Recordings are available. But this challenge is designed to be experienced live, in community, in real time."
          />
          <FaqItem
            question="Do I need to have a business already?"
            answer="No. You need a gift, a transformation you\u2019ve lived, and a willingness to build. That\u2019s it."
          />
          <FaqItem
            question="Will there be an opportunity to continue after the 7 days?"
            answer="Yes. Day 7 includes an invitation to join the AUREA Leaders ecosystem. But there is zero pressure. The challenge delivers standalone value."
          />
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta" id="register">
        <h2>
          Spring Is Here.
          <br />
          So Is the Version of You
          <br />
          That&rsquo;s Done Waiting.
        </h2>
        <p className="sub">
          7 days. Live calls. Daily meditations. First access to Seraph.
          <br />
          Your frequency. Your tribe. Your technology.
        </p>
        <button onClick={openModal} className="btn btn-large">
          Build What My Gift Deserves &mdash; Free
        </button>
        <p className="details">
          Starts Monday, April 21, 2026 &middot; Zero cost, full commitment
        </p>
        <p className="closing-quote">
          &ldquo;The hero inside you is not waiting for the fear to pass. They are waiting for you to
          move anyway. That is the alchemy. That is the call. ARISE.&rdquo;
        </p>
      </section>

      </main>

      <footer>
        <div className="logo">
          <Image src="/aurea-logo.png" alt="AUREA" width={78} height={60} />
        </div>
        <p>
          <a href="/privacy">Privacy</a> <a href="/terms">Terms</a> <a href="mailto:hello@aurealeaders.com">Contact</a>
        </p>
        <p style={{ marginTop: 12 }}>
          &copy; 2026 Aurea Leaders. All rights reserved.
          <br />
          Architected for the Golden Age.
        </p>
      </footer>

      {/* Sticky CTA */}
      <div className={`sticky-cta ${showSticky && !modalOpen ? "visible" : ""}`}>
        <p>Join the 7-Day ARISE Breakthrough &mdash; Free</p>
        <button onClick={openModal} className="btn">
          Build What My Gift Deserves &mdash; Free
        </button>
      </div>
    </>
  );
}

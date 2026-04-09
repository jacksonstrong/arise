"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import Image from "next/image";

function RegistrationModal({
  isOpen,
  onClose,
  originRect,
}: {
  isOpen: boolean;
  onClose: () => void;
  originRect: DOMRect | null;
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
      <div
        className="modal"
        ref={modalRef}
        style={originRect && !isOpen ? {
          transformOrigin: `${originRect.left + originRect.width / 2}px ${originRect.top + originRect.height / 2}px`,
        } : undefined}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close registration form">
          &times;
        </button>

        {status === "success" ? (
          <div className="success-celebration" style={{ textAlign: "center", padding: "20px 0", position: "relative", overflow: "hidden" }}>
            {/* Gold particle burst */}
            <div className="particle-burst" aria-hidden="true">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="particle"
                  style={{
                    "--angle": `${i * 30}deg`,
                    "--delay": `${i * 0.04}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
            {/* Animated checkmark */}
            <svg className="success-check" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="22" fill="none" stroke="var(--gold)" strokeWidth="1.5" className="check-circle" />
              <polyline points="15,25 22,32 34,18" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-mark" />
            </svg>
            <h3
              id="modal-title"
              className="success-stagger success-stagger-1"
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
              className="success-stagger success-stagger-2"
              style={{
                color: "var(--ash)",
                fontSize: 15,
                marginBottom: 8,
              }}
            >
              Welcome to ARISE. Check your email for details.
            </p>
            <p
              className="success-stagger success-stagger-3"
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
              Everything you need to break through &mdash; the coaching, the technology, the tribe &mdash; delivered in 7 days.
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
                : "Enter the 7-Day ARISE Challenge \u2014 Free"}
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

const TESTIMONIALS_DATA = [
  {
    quote: "Jackson\u2019s guidance has been nothing short of transformative. His unique blend of expertise and compassion empowered me to step into my true potential.",
    name: "Lakia Meadan",
    org: "Sacred Earth Travels",
  },
  {
    quote: "It\u2019s truly a deep dive into your soul\u2019s purpose. Being in a group container with Jackson and other vibrant souls is so expansive. 11 out of 10!",
    name: "Daniela Sardi & Tyler Schraeder",
    org: "Stage Secrets Alumni",
  },
  {
    quote: "Jackson knows how to bring your authenticity to life and break through the blocks to speaking your truth. My heart as an entrepreneur is in a better place.",
    name: "Kim Kong",
    org: "Founder, Movement University",
  },
  {
    quote: "You help me be my own healer \u2014 that is a true leader. Each morning, meditating with you changes the trajectory of my day. You have an incredible way to reframe difficult moments in life in a beautiful way.",
    name: "Natalie O\u2019Reilly",
    org: "Client",
  },
  {
    quote: "The time I\u2019ve invested with Jackson has led to tangible results in our business. I know he cares about his work, his clients, and seeing them succeed because he\u2019s shown up rain or shine for me and Skirt Club.",
    name: "Genevieve Lejeune",
    org: "Founder, Skirt Club",
  },
  {
    quote: "My investment with Jackson has helped me find hidden parts and pieces of my voice that needed to be heard. He\u2019s a trusted confidant, coach, and a passionate advocate for me every step of the way.",
    name: "Benjamin Zaemisch",
    org: "Founder, TheManicSerenity",
  },
  {
    quote: "As a person who struggled with my voice my whole life, I have definitely leveled-up. AUREA was nothing short of a magical experience. It\u2019s been a life-changing experience.",
    name: "Stage Secrets Graduate",
    org: "Stage Secrets Alumni",
  },
];

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS_DATA[idx];
  const prev = () => setIdx((i) => (i - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  const next = () => setIdx((i) => (i + 1) % TESTIMONIALS_DATA.length);

  return (
    <div style={{ marginTop: 64, position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        maxWidth: 700, margin: "0 auto",
      }}>
        <button
          onClick={prev}
          style={{
            background: "none", border: "1px solid var(--ash-dark)", borderRadius: "50%",
            width: 44, height: 44, color: "var(--gold)", fontSize: 18,
            cursor: "pointer", flexShrink: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            transition: "border-color .3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--ash-dark)")}
        >
          ‹
        </button>
        <div className="test-card" style={{
          flex: 1, textAlign: "center", padding: "32px 24px",
          minHeight: 200, display: "flex", flexDirection: "column",
          justifyContent: "center",
        }}>
          <p className="quote" style={{ marginBottom: 20 }}>
            {"\u201C"}{t.quote}{"\u201D"}
          </p>
          <p className="attr">{"\u2014"} {t.name}</p>
          <p className="attr-org">{t.org}</p>
        </div>
        <button
          onClick={next}
          style={{
            background: "none", border: "1px solid var(--ash-dark)", borderRadius: "50%",
            width: 44, height: 44, color: "var(--gold)", fontSize: 18,
            cursor: "pointer", flexShrink: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            transition: "border-color .3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--ash-dark)")}
        >
          ›
        </button>
      </div>
      <div style={{
        display: "flex", justifyContent: "center", gap: 8, marginTop: 16,
      }}>
        {TESTIMONIALS_DATA.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i === idx ? "var(--gold)" : "var(--ash-dark)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "background .3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [modalOrigin, setModalOrigin] = useState<DOMRect | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const openModal = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setModalOrigin(e.currentTarget.getBoundingClientRect());
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 600);
      setShowBackToTop(window.scrollY > 1200);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Cursor glow + hero parallax tracking
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isTouchDevice) return;

    // Create cursor glow element
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    const heroEl = document.querySelector(".hero") as HTMLElement | null;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let rafId: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      glowX = lerp(glowX, mouseX, 0.08);
      glowY = lerp(glowY, mouseY, 0.08);
      glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;

      // Shift hero glow toward cursor
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const cx = ((mouseX - rect.left) / rect.width - 0.5) * 30;
          const cy = ((mouseY - rect.top) / rect.height - 0.5) * 30;
          heroEl.style.setProperty("--glow-x", `${cx}px`);
          heroEl.style.setProperty("--glow-y", `${cy}px`);
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    // 3D tilt on cards
    const tiltCards = document.querySelectorAll<HTMLElement>(".card-tilt");
    const handleTiltEnter = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transition = "transform 0.1s ease";
    };
    const handleTiltMove = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    };
    const handleTiltLeave = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transition = "transform 0.4s ease";
      el.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale(1)";
    };

    tiltCards.forEach((card) => {
      card.addEventListener("mouseenter", handleTiltEnter);
      card.addEventListener("mousemove", handleTiltMove);
      card.addEventListener("mouseleave", handleTiltLeave);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      glow.remove();
      tiltCards.forEach((card) => {
        card.removeEventListener("mouseenter", handleTiltEnter);
        card.removeEventListener("mousemove", handleTiltMove);
        card.removeEventListener("mouseleave", handleTiltLeave);
      });
    };
  }, []);

  return (
    <>
      <RegistrationModal isOpen={modalOpen} onClose={closeModal} originRect={modalOrigin} />

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />

      <main>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div style={{ marginBottom: 8 }}>
          <Image src="/aurea-logo.png" alt="AUREA" width={130} height={100} priority />
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
            <h1 style={{ textAlign: "left", fontSize: "clamp(32px, 4.2vw, 56px)", margin: 0, lineHeight: 1.15 }}>
              You Know You Have <em>The Gift</em>, But Do You Have <em>The Identity</em>, <em>Sovereign AI</em>, and <em>Tribe</em> To <em>Fully Unleash</em> It?
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
              Watch and Join Us for the Breakthrough
            </p>
          </div>
        </div>

        <div className="hero-cta-row" style={{ display: "flex", gap: 16, margin: "32px auto 20px", width: "100%", maxWidth: 960, justifyContent: "center", padding: "0 16px", flexWrap: "wrap" }}>
          <button onClick={openModal} className="btn btn-large" style={{ flex: "1 1 280px", maxWidth: 440 }}>
            Enter the 7-Day ARISE Challenge &mdash; Free
          </button>
          <a href="https://serafina.aurealeaders.com" className="btn btn-large btn-secondary" style={{ flex: "1 1 280px", maxWidth: 440, textAlign: "center" }}>
            Try the AI Built to Manifest Your Mission
          </a>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)" aria-hidden="true">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--parchment)", letterSpacing: ".05em" }}>
            5 Stars on Google &middot; Trusted by 1,000&rsquo;s of coaches and entrepreneurs
          </p>
        </div>

        {/* Testimonial Ticker */}
        <div className="ticker-wrap">
          <div className="ticker">
            {[
              ["\u201cTHIS is the community I\u2019ve been searching for over the last decade.\u201d", "Michelle Hori, Executive Coach"],
              ["\u201cJackson\u2019s guidance has been nothing short of transformative.\u201d", "Lakia Meadan, Sacred Earth Travels"],
              ["\u201cIf you do the work, you will get the results.\u201d", "Fernando Subirats, Founder, The Manifestival"],
              ["\u201cIt\u2019s truly a deep dive into your soul\u2019s purpose. 11 out of 10!\u201d", "Daniela Sardi & Tyler Schraeder"],
              ["\u201cIt has renewed my vision and resolve around expanding my endeavors.\u201d", "Anamaria Aristizabal, Master Coach & Author"],
              ["\u201cJackson knows how to bring your authenticity to life.\u201d", "Kim Kong, Founder, Movement University"],
              ["\u201cThe quality of the content shared is priceless.\u201d", "Melly Anton, Entrepreneur"],
              ["\u201cHe will help you break free from your limiting beliefs.\u201d", "Christine Lee, Entrepreneur"],
              ["\u201cYou help me be my own healer \u2014 that is a true leader.\u201d", "Natalie O\u2019Reilly"],
              ["\u201cThe time I\u2019ve invested with Jackson has led to tangible results in our business.\u201d", "Genevieve Lejeune, Founder, Skirt Club"],
              ["\u201cHe\u2019s a trusted confidant, coach, and a passionate advocate for me every step of the way.\u201d", "Benjamin Zaemisch, Founder, TheManicSerenity"],
              ["\u201cI\u2019ve definitely leveled-up. AUREA was nothing short of a magical experience.\u201d", "Stage Secrets Graduate"],
              ["\u201cTHIS is the community I\u2019ve been searching for over the last decade.\u201d", "Michelle Hori, Executive Coach"],
              ["\u201cJackson\u2019s guidance has been nothing short of transformative.\u201d", "Lakia Meadan, Sacred Earth Travels"],
              ["\u201cIf you do the work, you will get the results.\u201d", "Fernando Subirats, Founder, The Manifestival"],
              ["\u201cIt\u2019s truly a deep dive into your soul\u2019s purpose. 11 out of 10!\u201d", "Daniela Sardi & Tyler Schraeder"],
            ].map(([quote, name], i) => (
              <span key={i} className="ticker-item" aria-hidden={i >= 8 ? "true" : undefined}>
                {quote} &mdash; <span className="name">{name}</span>
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* ===== THREE BLOCKS ===== */}
      <section className="blocks section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow eyebrow-lg text-center">What&rsquo;s Actually In Your Way</p>
          <h2 className="blocks-heading">
            The Three Thresholds You Must Cross
            <br />
            to Live Your Mission at Full Volume
          </h2>
          <p className="blocks-sub">
            Every course you&rsquo;ve taken tried to solve one of these. ARISE addresses all three
            &mdash; in 7 days, together, in the right order.
          </p>

          <div className="blocks-grid">
            <div className="block-card fade-in card-tilt" data-stagger>
              {/* Frequency icon — radiating soundwave */}
              <div style={{ margin: "0 auto 20px", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="28" cy="28" r="6" fill="var(--gold)" opacity="0.9" />
                  <circle cx="28" cy="28" r="14" stroke="var(--gold)" strokeWidth="1.2" opacity="0.5" />
                  <circle cx="28" cy="28" r="22" stroke="var(--gold)" strokeWidth="0.8" opacity="0.3" />
                  <circle cx="28" cy="28" r="27" stroke="var(--gold-dark)" strokeWidth="0.5" opacity="0.15" />
                </svg>
              </div>
              <h3>Frequency</h3>
              <p>
                You know you&rsquo;re gifted &mdash; but can you <em>feel</em> it?
              </p>
              <p>
                Without that felt sense alive in your body, every offer, every price, every piece of content comes from contraction &mdash; not sovereign power.
              </p>
              <p>
                <strong>We start here.</strong>{" "}Strategy doesn&rsquo;t work until the frequency is right.
              </p>
            </div>
            <div className="block-card fade-in card-tilt" data-stagger>
              {/* Tribe icon — three connected flames */}
              <div style={{ margin: "0 auto 20px", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28 8c0 0-6 8-6 14s2.7 8 6 8 6-2 6-8S28 8 28 8z" fill="var(--gold)" opacity="0.85" />
                  <path d="M14 20c0 0-4 6-4 10s2 6 4 6 4-1.5 4-6S14 20 14 20z" fill="var(--gold)" opacity="0.45" />
                  <path d="M42 20c0 0-4 6-4 10s2 6 4 6 4-1.5 4-6S42 20 42 20z" fill="var(--gold)" opacity="0.45" />
                  <line x1="18" y1="32" x2="24" y2="28" stroke="var(--gold-dark)" strokeWidth="0.8" opacity="0.4" />
                  <line x1="38" y1="32" x2="32" y2="28" stroke="var(--gold-dark)" strokeWidth="0.8" opacity="0.4" />
                  <circle cx="28" cy="44" r="3" stroke="var(--gold-dark)" strokeWidth="0.8" opacity="0.3" />
                  <circle cx="16" cy="44" r="3" stroke="var(--gold-dark)" strokeWidth="0.8" opacity="0.3" />
                  <circle cx="40" cy="44" r="3" stroke="var(--gold-dark)" strokeWidth="0.8" opacity="0.3" />
                  <line x1="19" y1="44" x2="25" y2="44" stroke="var(--gold-dark)" strokeWidth="0.6" opacity="0.25" />
                  <line x1="31" y1="44" x2="37" y2="44" stroke="var(--gold-dark)" strokeWidth="0.6" opacity="0.25" />
                </svg>
              </div>
              <h3>Tribe</h3>
              <p>
                You&rsquo;re building alone. And somewhere in your nervous system lives a primal fear: <em>if I fully become who I am, I&rsquo;ll be abandoned.</em>
              </p>
              <p>
                That fear only dissolves in the presence of co-creators who see your fire &mdash; and match it.
              </p>
              <p>
                <strong>You need a tribe that makes expansion feel safe.</strong>
              </p>
            </div>
            <div className="block-card fade-in card-tilt" data-stagger>
              {/* Strategy icon — compass rose */}
              <div style={{ margin: "0 auto 20px", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="28" cy="28" r="24" stroke="var(--gold-dark)" strokeWidth="0.8" opacity="0.35" />
                  <circle cx="28" cy="28" r="3" fill="var(--gold)" opacity="0.9" />
                  <polygon points="28,6 30,24 28,28 26,24" fill="var(--gold)" opacity="0.8" />
                  <polygon points="28,50 26,32 28,28 30,32" fill="var(--gold-dark)" opacity="0.5" />
                  <polygon points="6,28 24,26 28,28 24,30" fill="var(--gold-dark)" opacity="0.5" />
                  <polygon points="50,28 32,30 28,28 32,26" fill="var(--gold-dark)" opacity="0.5" />
                  <line x1="14" y1="14" x2="22" y2="22" stroke="var(--gold-dark)" strokeWidth="0.5" opacity="0.25" />
                  <line x1="42" y1="14" x2="34" y2="22" stroke="var(--gold-dark)" strokeWidth="0.5" opacity="0.25" />
                  <line x1="14" y1="42" x2="22" y2="34" stroke="var(--gold-dark)" strokeWidth="0.5" opacity="0.25" />
                  <line x1="42" y1="42" x2="34" y2="34" stroke="var(--gold-dark)" strokeWidth="0.5" opacity="0.25" />
                </svg>
              </div>
              <h3>Strategy</h3>
              <p>
                Vision without a plan stays a dream. Most strategy was designed for people selling products &mdash; not leaders carrying a message.
              </p>
              <p>
                We give you the roadmap: a validated offer, a live landing page, content in the world, and a 30-day plan to your first $10,000.
              </p>
              <p>
                <strong>All built from your truth &mdash; not someone else&rsquo;s template.</strong>
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
        <p className="fade-in transition-bridge-quote" style={{
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
          Gifted leaders don&rsquo;t break through until they build the infrastructure, tribe, and identity to hold their full power.
        </p>
        <p className="fade-in" style={{
          fontFamily: "var(--font-body-stack)",
          fontSize: 15,
          fontWeight: 300,
          color: "var(--parchment)",
          opacity: 0.6,
          maxWidth: 700,
          margin: "0 auto 48px",
          lineHeight: 1.6,
          letterSpacing: ".04em",
          position: "relative",
        }}>
          &ldquo;If you want to change your personal reality, you have to change your personality.&rdquo;
          <br />
          <span style={{ color: "var(--gold-dark)", fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase" }}>
            &mdash; Dr. Joe Dispenza
          </span>
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
        <div style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 900,
          background: "radial-gradient(circle, rgba(201, 168, 76, 0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div className="content" style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>

          {/* ——— Row 1: Text left · Image right ——— */}
          <div className="prob-row">
            <div>
              <p className="prob-label">You can feel it &mdash; something massive is trying to come through you</p>
              <div className="prob-text">
                <p>But you&rsquo;ve hit a ceiling &mdash; and you know it.</p>
                <p>You&rsquo;ve <em>outgrown</em> the version of yourself that got you here.</p>
                <p className="break">The identity that carried you this far <strong>can&rsquo;t carry you to what&rsquo;s next</strong>.</p>
                <p>Your nervous system isn&rsquo;t calibrated for the level you&rsquo;re stepping into.</p>
                <p>Your systems aren&rsquo;t yet built to scale &mdash; so you consciously or subconsciously play small.</p>
                <p>And most of the people around you &mdash; as much as they love you or doubt you &mdash; cannot get you where you&rsquo;re meant to go.</p>
              </div>
            </div>
            <div className="prob-img">
              <img src="/woman-horizon.jpg" alt="Woman silhouetted against golden horizon" />
            </div>
          </div>

          {/* Divider */}
          <div className="prob-divider">
            <div className="dl" />
            <div className="dd">&#10022;</div>
            <div className="dr" />
          </div>

          {/* ——— Row 2: Image left · Text right ——— */}
          <div className="prob-row">
            <div className="prob-img">
              <img src="/woman-doorway.jpg" alt="Woman stepping through cosmic doorway" />
            </div>
            <div>
              <p className="prob-label">The pattern that got you here won&rsquo;t get you there</p>
              <div className="prob-text">
                <p>So you keep striving. Keep pressing on. Keep showing up doing what <strong>USED TO</strong> work. What <strong>USED TO</strong> feel safe. Being who you <strong>USED TO</strong> be.</p>
                <p>But the <strong>growth has plateaued</strong>.</p>
                <p>The money isn&rsquo;t enough.</p>
                <p>Or if it is, you don&rsquo;t <em>FEEL</em> like it&rsquo;s enough.</p>
                <p className="break">And you know it&rsquo;s not a talent problem.</p>
                <p>It&rsquo;s an <strong>infrastructure</strong> and <strong>identity</strong> problem.</p>
                <p className="break">And here&rsquo;s the kicker &mdash; we all see that the world is being shaken to its core, and your people don&rsquo;t need you &ldquo;someday.&rdquo;</p>
                <p>They need you <em>now</em>. Fully operational.</p>
                <p>At a level you haven&rsquo;t given yourself permission to reach yet.</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="prob-divider">
            <div className="dl" />
            <div className="dd">&#10022;</div>
            <div className="dr" />
          </div>

          {/* ——— Row 3: Text left · Image right ——— */}
          <div className="prob-row">
            <div>
              <p className="prob-label">The cost of staying here is someone else&rsquo;s healing</p>
              <div className="prob-text">
                <p className="break"><strong>Every day you stay in the status quo is a day someone who needed your medicine&hellip; didn&rsquo;t find it.</strong></p>
                <p>You don&rsquo;t need more inspiration.</p>
                <p>You don&rsquo;t need another course.</p>
                <p className="break">You don&rsquo;t need to start over.</p>
                <p><strong>You need to feel your next-level self in your body.</strong></p>
                <p><strong>You need to know WTF to do with AI before you get left in the dust or burnout trying to hold 1,000 things solo.</strong></p>
                <p><strong>You need to surround yourself with people who make your subconscious feel safe to shine so that staying small is impossible.</strong></p>
              </div>
            </div>
            <div className="prob-img">
              <img src="/the-cosmic-boob.jpg" alt="Hand reaching toward golden constellation" />
            </div>
          </div>

          <div className="gold-divider" />
          <div style={{ textAlign: "center" }}>
            <button onClick={openModal} className="btn">
              Enter the 7-Day ARISE Challenge &mdash; Free
            </button>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU GET SNAPSHOT ===== */}
      <section className="section-pad fade-in" style={{ background: "var(--ink)", paddingBottom: 0 }}>
        <div style={{ margin: "0 auto", maxWidth: 820, width: "100%" }}>
          <p className="eyebrow eyebrow-lg text-center">What You Get</p>
          <p style={{
            fontFamily: "var(--font-heading-stack)",
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 300,
            color: "var(--parchment)",
            textAlign: "center",
            lineHeight: 1.5,
            marginBottom: 48,
            opacity: 0.9,
          }}>
            Access Live Coaching, Transformational Meditations, Advanced AI Insights, &amp; a Tribe of Co-Creators That Make Your Next Breakthrough an Inevitability
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {[
              { icon: "\u2666", title: "A Nervous System", subtitle: "That Scales", desc: "Feel your next-level self in your body" },
              { icon: "\u2699", title: "An AI Business", subtitle: "Engine", desc: "This goes way beyond ChatGPT." },
              { icon: "tribe", title: "A Tribe That", subtitle: "Elevates You", desc: "People who make staying small impossible" },
            ].map((item, i) => (
              <div
                key={i}
                className="card-hover card-tilt"
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
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  {item.icon === "tribe" ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="7" r="3" />
                      <circle cx="5" cy="10" r="2.5" />
                      <circle cx="19" cy="10" r="2.5" />
                      <path d="M8 21v-2a4 4 0 0 1 8 0v2" />
                      <path d="M1 21v-1.5a3.5 3.5 0 0 1 5-3.15" />
                      <path d="M23 21v-1.5a3.5 3.5 0 0 0-5-3.15" />
                    </svg>
                  ) : item.icon}
                </div>
                <p className="snapshot-card-title">
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
      </section>

      {/* ===== GUIDES ===== */}
      <section className="guide section-pad">
        <div className="container-wide">
          <p className="eyebrow eyebrow-lg text-center">Your Guides</p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
          }} className="guides-row">

            {/* Jackson */}
            <div className="fade-in">
              <Image src="/jackson-headshot.jpg" alt="Jackson Strong" width={397} height={389} style={{ width: "100%", height: "auto", aspectRatio: "1/1", objectFit: "cover", borderRadius: 2, marginBottom: 24 }} />
              <div className="guide-text">
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

            {/* Patrick */}
            <div className="fade-in">
              <Image src="/patrick-headshot.jpg" alt="Patrick Farrell" width={397} height={397} style={{ width: "100%", height: "auto", aspectRatio: "1/1", objectFit: "cover", borderRadius: 2, marginBottom: 24 }} />
              <div className="guide-text">
                <h2>Patrick Farrell</h2>
                <p className="title-sub">
                  AI &amp; Software Architect &middot; Creator of the Adhara Framework
                </p>
                <p>
                  Two engineering degrees from Virginia Tech. Senior Software Engineer in
                  New York. A decade building systems for companies that didn&rsquo;t need
                  my help.
                </p>
                <p>
                  The turning point wasn&rsquo;t dramatic &mdash; it was quiet. I kept meeting
                  coaches, healers, and creators who had transformational gifts and absolutely
                  no infrastructure to deliver them. They were duct-taping together twelve
                  different tools and losing hours every week to tech that fought them at
                  every step.
                </p>
                <p>
                  So I stopped building for corporations and started building for them. 50+
                  projects launched. 800+ community members. Over $1M generated for the
                  founders I serve.
                </p>
                <div className="vulnerability">
                  <p>
                    Here&rsquo;s what I&rsquo;ve learned: the technology most entrepreneurs
                    are using was never designed for the work they&rsquo;re doing. It was
                    designed for marketers selling products &mdash; not leaders carrying
                    a message.
                  </p>
                </div>
                <p>
                  That gap is why I created the Adhara Framework and why I built the technology
                  behind Serafina. AI that doesn&rsquo;t just automate &mdash; it understands
                  the kind of work you do and builds alongside you.
                </p>
                <p>
                  During ARISE, the systems you&rsquo;ll use have my fingerprints on every
                  layer. I&rsquo;m not here to teach you to code. I&rsquo;m here to make sure
                  the technology under your mission is as strong as the mission itself.
                </p>
              </div>
            </div>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* ===== 7-DAY JOURNEY ===== */}
      <section className="journey section-pad">
        <div className="container-wide">
          <p className="eyebrow eyebrow-lg text-center">The 7-Day Journey</p>
          <p style={{ fontSize: 13, letterSpacing: ".06em", color: "var(--ash)", textAlign: "center", marginBottom: 24 }}>
            Live Coaching &middot; Daily Somatic Meditations &middot; First Access to{" "}
            <strong style={{ color: "var(--gold)" }}>Serafina</strong> &mdash; the AI Platform Built
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
              <h3>Build Your Offer &mdash; With Serafina</h3>
              <p>
                Your gifts become a structure: a name, a promise, a price, a format. Today you step
                into <strong style={{ color: "var(--gold-light)" }}>Serafina</strong> for the first
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
              Enter the 7-Day ARISE Challenge &mdash; Free
            </button>
          </div>
        </div>
      </section>

      {/* ===== SERAPH SECTION ===== */}
      <section className="seraph section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow eyebrow-lg text-center" style={{ color: "var(--gold)" }}>
            Introducing Serafina
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
            Every tool on the market was built for marketers. Serafina was built for <em>you</em>.
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

          {/* Serafina Video */}
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
                Serafina Video Coming Soon
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
                className="feature-card-hover fade-in card-tilt"
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
                Serafina is not another CRM with a chatbot bolted on. It is a sovereign operating
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
              <div style={{ marginTop: 28 }}>
                <a
                  href="https://serafina.aurealeaders.com"
                  className="btn btn-large"
                  style={{ textDecoration: "none", display: "inline-block" }}
                >
                  Meet Serafina Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUTCOMES ===== */}
      <section className="outcomes section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow eyebrow-lg text-center">In 7 Days, You Will Have...</p>
          <div className="outcomes-grid">
            {[
              ["Your Frequency", "The felt sense of your highest self \u2014 activated in your body, not just your mind."],
              ["Your Genius Statement", "The 1-2 sentence distillation of the transformation only you can deliver."],
              ["Your Co-Creator Pod", "A matched tribe of builders at your level \u2014 people who see your fire and refuse to let you shrink."],
              ["Your Identity Declarations", "5 present-tense statements about who you are becoming \u2014 anchored somatically."],
              ["Your First Offer + Landing Page", "Named, priced, structured, and LIVE \u2014 built inside Serafina with Serafina guiding the process."],
              ["Your First Piece of Content", "Something real, shared with a real audience. The ice is broken forever."],
              ["Your Regulation Practice", "A nervous system protocol for YOUR wiring \u2014 so you can hold the wealth, visibility, and impact that\u2019s coming."],
              ["Hands-On Serafina Experience", "You will have used the platform no one else has seen \u2014 and your feedback will shape its future."],
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
          <p className="eyebrow eyebrow-lg text-center">The Alchemy</p>
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
          <p className="eyebrow eyebrow-lg text-center">Is This For You?</p>
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
            question="What is Serafina?"
            answer="Serafina is the world\u2019s first sovereign operating system for transformation leaders. During ARISE, you experience it firsthand \u2014 and your feedback directly shapes what it becomes."
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
          7 days. Live calls. Daily meditations. First access to Serafina.
          <br />
          Your frequency. Your tribe. Your technology.
        </p>
        <button onClick={openModal} className="btn btn-large">
          Enter the 7-Day ARISE Challenge &mdash; Free
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
        <p>It&rsquo;s time for your next breakthrough</p>
        <button onClick={openModal} className="btn">
          Enter the 7-Day ARISE Challenge &mdash; Free
        </button>
      </div>

      {/* Back to top */}
      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18,15 12,9 6,15" />
        </svg>
      </button>
    </>
  );
}

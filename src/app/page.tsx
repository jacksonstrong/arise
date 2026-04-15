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
  const submittingRef = useRef(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
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
    } finally {
      submittingRef.current = false;
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
            {/* AUREA logo */}
            <Image
              src="/aurea-logo.png"
              alt="AUREA"
              width={64}
              height={64}
              className="success-stagger success-stagger-1"
              style={{
                width: 64,
                height: "auto",
                margin: "0 auto 16px",
                display: "block",
                opacity: 0.95,
              }}
            />
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
                marginBottom: 4,
              }}
            >
              Welcome to ARISE. Check your email for details.
            </p>
            <p
              className="success-stagger success-stagger-2"
              style={{
                color: "var(--gold-light)",
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 12,
                marginBottom: 16,
              }}
            >
              April 21&ndash;27 (Tue&ndash;Mon) &middot; 7:00 PM CT &middot; Live on Zoom
            </p>
            {/* Calendar buttons */}
            <div
              className="success-stagger success-stagger-3"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                margin: "0 auto 20px",
                maxWidth: 280,
              }}
            >
              <a
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=AUREA+Arise+Challenge+-+Live+on+Zoom&dates=20260422T000000Z/20260422T010000Z&recur=RRULE:FREQ%3DDAILY;COUNT%3D7&details=Join+us+live+on+Zoom+for+the+AUREA+Arise+Challenge.%0A%0AZoom%3A+https%3A%2F%2Fus06web.zoom.us%2Fj%2F5608769933%3Fpwd%3DV2o1ZTNXL3VMaENEVmhuYnJFTjdpZz09&location=https%3A%2F%2Fus06web.zoom.us%2Fj%2F5608769933%3Fpwd%3DV2o1ZTNXL3VMaENEVmhuYnJFTjdpZz09"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  border: "1px solid var(--gold)",
                  borderRadius: 2,
                  color: "var(--gold)",
                  textDecoration: "none",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-body-stack)",
                }}
              >
                Add to Google Calendar
              </a>
              <a
                href="/AUREA-Arise-Challenge.ics"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  border: "1px solid var(--gold)",
                  borderRadius: 2,
                  color: "var(--gold)",
                  textDecoration: "none",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-body-stack)",
                }}
              >
                Add to Apple / Outlook
              </a>
            </div>
            <p
              className="success-stagger success-stagger-3"
              style={{
                fontFamily: "var(--font-heading-stack)",
                fontStyle: "italic",
                color: "var(--gold-dark)",
                fontSize: 16,
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              &ldquo;The hero inside you is not waiting for the fear to pass.
              They are waiting for you to move anyway.&rdquo;
            </p>
            <p
              className="success-stagger success-stagger-3"
              style={{
                color: "var(--ash)",
                fontSize: 13,
                marginTop: 12,
              }}
            >
              Know someone else called to rise?
              <br />
              Send them to{" "}
              <a
                href="https://arise.aurealeaders.com"
                style={{ color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold-dark)" }}
              >
                arise.aurealeaders.com
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="registration-form">
            <p className="modal-eyebrow">The 7-Day Invitation</p>
            <h3 id="modal-title">
              Cross <em>the Threshold.</em>
            </h3>
            <div className="modal-ornament" aria-hidden="true" />
            <p className="modal-sub">
              The <em>Identity</em>, the <em>Sovereign AI System</em>, and the <em>Tribe</em>
              <br />
              &mdash; delivered in 7 days.
            </p>

            <ul className="modal-benefits" aria-label="What you receive">
              <li>
                <span className="modal-benefit-mark" aria-hidden="true">✦</span>
                <span>7 live transmissions with Jackson &amp; Patrick</span>
              </li>
              <li>
                <span className="modal-benefit-mark" aria-hidden="true">✦</span>
                <span>Daily ARISE rituals &amp; full replays</span>
              </li>
              <li>
                <span className="modal-benefit-mark" aria-hidden="true">✦</span>
                <span>Your place in the tribe of rising leaders</span>
              </li>
            </ul>

            <div className="modal-fields">
              <label htmlFor="reg-name" className="sr-only">Full name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-describedby={status === "error" ? "reg-error" : undefined}
                aria-invalid={status === "error"}
                required
              />
              <label htmlFor="reg-email" className="sr-only">Email address</label>
              <input
                id="reg-email"
                type="email"
                placeholder="Your best email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={status === "error" ? "reg-error" : undefined}
                aria-invalid={status === "error"}
                required
              />
              <label htmlFor="reg-phone" className="sr-only">Phone number (optional)</label>
              <input
                id="reg-phone"
                type="tel"
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-describedby={status === "error" ? "reg-error" : undefined}
              />
            </div>

            <button
              type="submit"
              className="btn btn-large btn-pulse"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "Crossing the Threshold..."
                : "Claim My Place \u2014 Free"}
            </button>
            {status === "error" && <p id="reg-error" className="error-msg" role="alert">{errorMsg}</p>}
            <p className="modal-details-primary">
              Starts Tuesday, April 21 &middot; 7:00 PM CT &middot; Live on Zoom
            </p>
            <p className="modal-details-secondary">
              Nothing to pay &middot; Everything to claim
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
  {
    quote: "AUREA is a group unlike any I\u2019ve discovered before. Jackson has curated the most progressive minds, people who think far beyond the status quo and are actively creating the world they want to live in. Attending this event was a turning point for my own free thinking and molding a new understanding of what is possible.",
    name: "Kim Ehardt",
    org: "Google Review \u2605\u2605\u2605\u2605\u2605",
  },
  {
    quote: "The curation of this event was amazing. I could tell that much thought went into the attendee experience. Each speaker had such conviction and care into what they were sharing. The diversity of topics truly made this event applicable to anyone that wants to be a better human.",
    name: "Brandi Marek",
    org: "Google Review \u2605\u2605\u2605\u2605\u2605",
  },
  {
    quote: "This event stands out as the pinnacle of my experiences. The atmosphere was filled with love, acceptance, and genuine support. From the very beginning, it was evident that this event was designed to be interactive and transformative, unlike any I had attended in my 30 plus years of exploration.",
    name: "Marc & Staci Kessler",
    org: "Google Review \u2605\u2605\u2605\u2605\u2605",
  },
  {
    quote: "Life changing event for me on soooo many levels. I was at a low point in life. Was invited to this event and it helped put me on a new life path trajectory. Met incredible heart-centered, giving, loving, like-minded tribe. Felt seen, heard, and understood.",
    name: "Gabriel Maldonado",
    org: "Google Review \u2605\u2605\u2605\u2605\u2605",
  },
  {
    quote: "This event was epic!! The vibe was so high with many extraordinary moments. Aurea brought creative, talented, and love-filled beings together to create magic. I made new friends and found my soul tribe.",
    name: "Lisa",
    org: "Google Review \u2605\u2605\u2605\u2605\u2605",
  },
  {
    quote: "I was very fortunate to attend one of their three-day events live in Miami, and bring 9 of my friends along with me! That was so transformational for me personally as well as each of the people I brought with. Following it up with a 21-day challenge group has produced amazing results in my life.",
    name: "Eric Balas",
    org: "Google Review \u2605\u2605\u2605\u2605\u2605",
  },
  {
    quote: "AUREA seminar was an expectacular and very intensive 3-day event! It was full of amazing experiences, speakers, and wonderful crowd of participants! Great community! I will definitely come back next time!",
    name: "Antonio Ponte",
    org: "Google Review \u2605\u2605\u2605\u2605\u2605",
  },
];

const QUOTE_TRUNCATE_LENGTH = 180;

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const t = TESTIMONIALS_DATA[idx];
  const isLong = t.quote.length > QUOTE_TRUNCATE_LENGTH;
  const displayQuote = !isLong || expanded ? t.quote : t.quote.slice(0, QUOTE_TRUNCATE_LENGTH).replace(/\s+\S*$/, "") + "\u2026";

  const prev = () => { setIdx((i) => (i - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length); setExpanded(false); };
  const next = () => { setIdx((i) => (i + 1) % TESTIMONIALS_DATA.length); setExpanded(false); };

  return (
    <div style={{ marginTop: 64, position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        width: 700, maxWidth: "100%", margin: "0 auto",
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
        <div style={{
          flex: 1, textAlign: "center", padding: "28px 24px",
          border: "1px solid var(--ash-dark)", borderRadius: 2,
          height: 220, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
          <p style={{
            fontFamily: "var(--font-heading-stack)",
            fontStyle: "italic",
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--parchment)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
            marginBottom: 10,
          }}>
            {"\u201C"}{displayQuote}{"\u201D"}
          </p>
          <p style={{ fontSize: 13, color: "var(--gold-dark)", fontWeight: 400, margin: "0 0 2px" }}>{"\u2014"} {t.name}</p>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: 0 }}>{t.org}</p>
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

const HERO_TESTIMONIALS = [
  { quote: "THIS is the community I\u2019ve been searching for over the last decade.", name: "Michelle Hori", org: "Executive Coach" },
  { quote: "Jackson\u2019s guidance has been nothing short of transformative. His unique blend of expertise and compassion empowered me to step into my true potential.", name: "Lakia Meadan", org: "Sacred Earth Travels" },
  { quote: "If you do the work, you will get the results.", name: "Fernando Subirats", org: "Founder, The Manifestival" },
  { quote: "It\u2019s truly a deep dive into your soul\u2019s purpose. Being in a group container with Jackson and other vibrant souls is so expansive. 11 out of 10!", name: "Daniela Sardi & Tyler Schraeder", org: "Stage Secrets Alumni" },
  { quote: "It has renewed my vision and resolve around expanding my endeavors.", name: "Anamaria Aristizabal", org: "Master Coach & Author" },
  { quote: "Jackson knows how to bring your authenticity to life and break through the blocks to speaking your truth.", name: "Kim Kong", org: "Founder, Movement University" },
  { quote: "The quality of the content shared is priceless.", name: "Melly Anton", org: "Entrepreneur" },
  { quote: "He will help you break free from your limiting beliefs.", name: "Christine Lee", org: "Entrepreneur" },
  { quote: "You help me be my own healer \u2014 that is a true leader. Each morning, meditating with you changes the trajectory of my day. You have an incredible way to reframe difficult moments in life in a beautiful way.", name: "Natalie O\u2019Reilly", org: "Client" },
  { quote: "The time I\u2019ve invested with Jackson has led to tangible results in our business. I know he cares about his work, his clients, and seeing them succeed because he\u2019s shown up rain or shine for me and Skirt Club.", name: "Genevieve Lejeune", org: "Founder, Skirt Club" },
  { quote: "My investment with Jackson has helped me find hidden parts and pieces of my voice that needed to be heard. He\u2019s a trusted confidant, coach, and a passionate advocate for me every step of the way.", name: "Benjamin Zaemisch", org: "Founder, TheManicSerenity" },
  { quote: "AUREA is a group unlike any I\u2019ve discovered before. Jackson has curated the most progressive minds, people who think far beyond the status quo and are actively creating the world they want to live in. Attending this event was a turning point for my own free thinking and molding a new understanding of what is possible.", name: "Kim Ehardt", org: "Google Review \u2605\u2605\u2605\u2605\u2605" },
  { quote: "The curation of this event was amazing. I could tell that much thought went into the attendee experience. Each speaker had such conviction and care into what they were sharing. The diversity of topics truly made this event applicable to anyone that wants to be a better human.", name: "Brandi Marek", org: "Google Review \u2605\u2605\u2605\u2605\u2605" },
  { quote: "This event stands out as the pinnacle of my experiences. The atmosphere was filled with love, acceptance, and genuine support. From the very beginning, it was evident that this event was designed to be interactive and transformative, unlike any I had attended in my 30 plus years of exploration.", name: "Marc & Staci Kessler", org: "Google Review \u2605\u2605\u2605\u2605\u2605" },
  { quote: "Life changing event for me on soooo many levels. I was at a low point in life. Was invited to this event and it helped put me on a new life path trajectory. Met incredible heart-centered, giving, loving, like-minded tribe. Felt seen, heard, and understood.", name: "Gabriel Maldonado", org: "Google Review \u2605\u2605\u2605\u2605\u2605" },
  { quote: "This event was epic!! The vibe was so high with many extraordinary moments. Aurea brought creative, talented, and love-filled beings together to create magic. I made new friends and found my soul tribe.", name: "Lisa", org: "Google Review \u2605\u2605\u2605\u2605\u2605" },
  { quote: "I was very fortunate to attend one of their three-day events live in Miami, and bring 9 of my friends along with me! That was so transformational for me personally as well as each of the people I brought with. Following it up with a 21-day challenge group has produced amazing results in my life.", name: "Eric Balas", org: "Google Review \u2605\u2605\u2605\u2605\u2605" },
  { quote: "AUREA seminar was an expectacular and very intensive 3-day event! It was full of amazing experiences, speakers, and wonderful crowd of participants! Great community! I will definitely come back next time!", name: "Antonio Ponte", org: "Google Review \u2605\u2605\u2605\u2605\u2605" },
];

function HeroTestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const t = HERO_TESTIMONIALS[idx];
  const truncated = t.quote.length > 180 ? t.quote.slice(0, 180).replace(/\s+\S*$/, "") + "\u2026" : t.quote;

  const prev = () => setIdx((i) => (i - 1 + HERO_TESTIMONIALS.length) % HERO_TESTIMONIALS.length);
  const next = () => setIdx((i) => (i + 1) % HERO_TESTIMONIALS.length);

  return (
    <div style={{ marginTop: 32, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, width: 700, maxWidth: "100%", margin: "0 auto" }}>
        <button
          onClick={prev}
          style={{
            background: "none", border: "1px solid var(--ash-dark)", borderRadius: "50%",
            width: 44, height: 44, color: "var(--gold)", fontSize: 18,
            cursor: "pointer", flexShrink: 0, display: "flex",
            alignItems: "center", justifyContent: "center", transition: "border-color .3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--ash-dark)")}
        >‹</button>
        <div style={{
          flex: 1, textAlign: "center", padding: "28px 24px",
          border: "1px solid var(--ash-dark)", borderRadius: 2,
          height: 220, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
          <p style={{
            fontFamily: "var(--font-heading-stack)",
            fontStyle: "italic",
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--parchment)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
            marginBottom: 10,
          }}>
            {"\u201C"}{truncated}{"\u201D"}
          </p>
          <p style={{ fontSize: 13, color: "var(--gold-dark)", fontWeight: 400, margin: "0 0 2px" }}>{"\u2014"} {t.name}</p>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: 0 }}>{t.org}</p>
        </div>
        <button
          onClick={next}
          style={{
            background: "none", border: "1px solid var(--ash-dark)", borderRadius: "50%",
            width: 44, height: 44, color: "var(--gold)", fontSize: 18,
            cursor: "pointer", flexShrink: 0, display: "flex",
            alignItems: "center", justifyContent: "center", transition: "border-color .3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--ash-dark)")}
        >›</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
        {HERO_TESTIMONIALS.map((_, i) => (
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

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleUnmute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    if (v.paused) v.play().catch(() => {});
    setIsMuted(false);
  };

  return (
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
      <video
        ref={videoRef}
        src="https://pub-e02c13db6b014a7a8fd6c604391c7e43.r2.dev/frequency-mission-web.mp4"
        title="Frequency of the Mission-Driven Identity"
        autoPlay
        muted
        playsInline
        controls={!isMuted}
        preload="metadata"
        onVolumeChange={(e) => {
          if (!e.currentTarget.muted && isMuted) setIsMuted(false);
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
          backgroundColor: "#000",
        }}
      />
      {isMuted && (
        <button
          type="button"
          onClick={handleUnmute}
          aria-label="Unmute video"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "linear-gradient(180deg, rgba(13,11,8,0.15) 0%, rgba(13,11,8,0.55) 100%)",
            border: 0,
            cursor: "pointer",
            color: "var(--parchment)",
            fontFamily: "var(--font-body-stack)",
            transition: "background 0.3s ease",
          }}
        >
          <span
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              border: "1.5px solid var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(13,11,8,0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 0 48px rgba(201,168,76,0.35)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="var(--gold)" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </span>
          <span
            style={{
              fontSize: 12,
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: "var(--gold)",
              fontWeight: 400,
            }}
          >
            Tap to Unmute
          </span>
        </button>
      )}
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
          Join the 7-Day ARISE Breakthrough &middot; Launching Tuesday, April 21, 2026
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
              You Know You Have <em>The Gift</em>, But Do You Have <em>The Identity</em>, <em>Sovereign AI System</em>, &amp; <em>Tribe</em> To <em>Unleash</em> It?
            </h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <HeroVideo />
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

        <div className="hero-cta-row" style={{ display: "flex", margin: "32px auto 20px", width: "100%", maxWidth: 480, justifyContent: "center", padding: "0 16px" }}>
          <button onClick={openModal} className="btn btn-large" style={{ flex: 1, whiteSpace: "nowrap" }}>
            Enter the 7-Day ARISE Challenge &mdash; Free
          </button>
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
            AUREA &mdash; 5 Stars on Google &middot; Trusted by 1,000&rsquo;s of Entrepreneurs, Coaches, and Leaders
          </p>
        </div>

        {/* Hero Testimonial Carousel */}
        <HeroTestimonialCarousel />

      </section>

      {/* ===== THREE BLOCKS ===== */}
      <section className="blocks section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow eyebrow-lg text-center">What&rsquo;s Actually In Your Way</p>
          <h2 className="blocks-heading">
            The Three Thresholds You Must Cross to Live Your Mission at Full Volume
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
              {/* Tribe icon — three figures, circle of belonging */}
              <div style={{ margin: "0 auto 20px", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Center figure — most prominent */}
                  <circle cx="28" cy="13" r="5.5" fill="var(--gold)" opacity="0.9" />
                  <path d="M21 30c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9" />
                  {/* Left figure */}
                  <circle cx="13" cy="18" r="4.5" fill="var(--gold)" opacity="0.6" />
                  <path d="M7.5 33c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                  {/* Right figure */}
                  <circle cx="43" cy="18" r="4.5" fill="var(--gold)" opacity="0.6" />
                  <path d="M37.5 33c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                  {/* Unifying arc beneath */}
                  <path d="M9 44 Q28 53 47 44" stroke="var(--gold)" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.3" />
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
        background: "var(--ink)",
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
              <div className="prob-img prob-img-mobile">
                <Image src="/woman-horizon.jpg" alt="Woman silhouetted against golden horizon" fill sizes="(max-width: 860px) 100vw, 50vw" style={{ objectFit: "cover" }} />
              </div>
              <div className="prob-text">
                <p>But you&rsquo;ve hit a ceiling &mdash; and you know it.</p>
                <p>You&rsquo;ve <em>outgrown</em> the version of yourself that got you here.</p>
                <p className="break">The identity that carried you this far <strong>can&rsquo;t carry you to what&rsquo;s next</strong>.</p>
                <p>Your nervous system isn&rsquo;t calibrated for the level you&rsquo;re stepping into.</p>
                <p>Your systems aren&rsquo;t yet built to scale &mdash; so you consciously or subconsciously play small.</p>
                <p>And most of the people around you &mdash; as much as they love you or doubt you &mdash; cannot get you where you&rsquo;re meant to go.</p>
              </div>
            </div>
            <div className="prob-img prob-img-desktop">
              <Image src="/woman-horizon.jpg" alt="Woman silhouetted against golden horizon" fill sizes="(max-width: 860px) 100vw, 50vw" style={{ objectFit: "cover" }} />
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
            <div className="prob-img prob-img-desktop">
              <Image src="/woman-doorway.jpg" alt="Woman stepping through cosmic doorway" fill sizes="(max-width: 860px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p className="prob-label">but The pattern that got you here won&rsquo;t get you there</p>
              <div className="prob-img prob-img-mobile">
                <Image src="/woman-doorway.jpg" alt="Woman stepping through cosmic doorway" fill sizes="(max-width: 860px) 100vw, 50vw" style={{ objectFit: "cover" }} />
              </div>
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
              <p className="prob-label">and The cost of staying here is someone else&rsquo;s healing</p>
              <div className="prob-img prob-img-mobile">
                <Image src="/the-cosmic-boob.jpg" alt="Hand reaching toward golden constellation" fill sizes="(max-width: 860px) 100vw, 50vw" style={{ objectFit: "cover" }} />
              </div>
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
            <div className="prob-img prob-img-desktop">
              <Image src="/the-cosmic-boob.jpg" alt="Hand reaching toward golden constellation" fill sizes="(max-width: 860px) 100vw, 50vw" style={{ objectFit: "cover" }} />
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

      {/* ===== SYSTEM GAP ===== */}
      <section className="section-pad fade-in" style={{ background: "var(--ink)", borderTop: "1px solid var(--ash-dark)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", padding: "0 24px" }}>
          <h2 style={{
            fontFamily: "var(--font-heading-stack)",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 400,
            color: "var(--parchment)",
            lineHeight: 1.2,
            marginBottom: 36,
          }}>
            The Real Reason You Haven&rsquo;t Gotten the Results You Want Yet
          </h2>
          <p style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: "rgba(247, 243, 236, 0.85)",
            lineHeight: 1.8,
            marginBottom: 28,
          }}>
            You know you have something powerful. You&rsquo;ve always known. But you can&rsquo;t fully articulate it yet &mdash; and that gap between what you carry and what you can communicate is costing you clients, income, and confidence every single day.
          </p>
          <p style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: "rgba(247, 243, 236, 0.85)",
            lineHeight: 1.8,
            marginBottom: 28,
          }}>
            You&rsquo;ve tried to build the structure. But every time things start to work, something pulls you back. You jump to the next idea before finishing the last one. You overcomplicate, get overwhelmed, and crash. You&rsquo;re tired of pretending you&rsquo;re fine &mdash; tired of living the same day on repeat &mdash; when you can feel how close you are to something real.
          </p>
          <p style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: "rgba(247, 243, 236, 0.85)",
            lineHeight: 1.8,
            marginBottom: 28,
          }}>
            And underneath all of it: you want to stop surviving and finally start thriving. You want to be paid for your gifts without feeling guilty about it. You want soul-level connection with people who get it &mdash; not surface-level networking with people who don&rsquo;t. You want a place where structure meets soul.
          </p>
          <p style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: "rgba(247, 243, 236, 0.85)",
            lineHeight: 1.8,
            marginBottom: 48,
          }}>
            That place has never existed. Until now.
          </p>

          <button onClick={openModal} className="btn btn-large">
            Enter the 7-Day ARISE Challenge &mdash; Free
          </button>
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
                  My career began in high-tech private equity and the startup world, working for
                  multiple companies valued over $300M. I was good at it. But I was dying in the matrix.
                </p>
                <p>
                  In 2016, the tension between my corporate life and my soul&rsquo;s work snapped. I
                  had a legitimate nervous breakdown, got divorced, quit the corporate life, and
                  founded my first company serving purpose-driven entrepreneurs.
                </p>
                <p>
                  Since then, I&rsquo;ve generated over $600,000 helping transformational leaders find
                  their message, build their offer, and monetize their mission &mdash; 10,000+ hours
                  in the room with people just like you.
                </p>
                <div className="vulnerability">
                  <p>
                    I need to tell you something people in my position aren&rsquo;t supposed to say:
                    this past year has been one of the hardest of my life. I have felt the same fear,
                    the same contraction, the same voice whispering &ldquo;who are you to do this&rdquo;
                    that I know you&rsquo;re feeling right now.
                  </p>
                </div>
                <p>
                  I went into seclusion in the forests of East Texas. I sat with deep medicines. I
                  confronted every shadow holding me back &mdash; not to bypass it, but to{" "}
                  <em>alchemize</em> it. ARISE is what I found at the bottom. The most concentrated,
                  distilled essence of everything I know works.
                </p>
                <p>
                  I&rsquo;m not here as a guru. I&rsquo;m here as a builder who went into the fire
                  &mdash; mine and yours &mdash; and came back with something real. From the arena.
                  And the arena is still where I live.
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
                into <strong style={{ color: "var(--gold-light)" }}>Serafina</strong>{" "}for the first
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
            The World&rsquo;s First Sovereign Operating System for Transformational Leaders
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "rgba(247, 243, 236, 0.85)",
              maxWidth: 620,
              margin: "0 auto 48px",
              fontSize: 18,
              lineHeight: 1.75,
            }}
          >
            The fastest path from inner work to outer impact — built for the way you actually think, feel, and create.
          </p>
          <div className="serafina-features-grid" style={{ margin: "0 auto 56px" }}>
            {[
              {
                icon: (
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ color: "var(--gold)" }}>
                    <path d="M6 26C6 26 14 13 26 13C38 13 46 26 46 26C46 26 38 39 26 39C14 39 6 26 6 26Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <circle cx="26" cy="26" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="26" cy="26" r="2.5" fill="currentColor"/>
                    <line x1="26" y1="2" x2="26" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="26" y1="44" x2="26" y2="50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="2" y1="26" x2="8" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="44" y1="26" x2="50" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Awareness of Your Gifts",
                desc: "Surface what you were born to offer, with clarity so sharp your ideal client feels it before you finish the sentence.",
              },
              {
                icon: (
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ color: "var(--gold)" }}>
                    <path d="M34 6C25 8 18 16 18 26C18 36 25 44 34 46C23 43 15 35 15 26C15 17 23 9 34 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                    <circle cx="38" cy="12" r="2.5" fill="currentColor"/>
                    <circle cx="44" cy="7" r="1.5" fill="currentColor" opacity="0.5"/>
                    <circle cx="42" cy="18" r="1.5" fill="currentColor" opacity="0.5"/>
                  </svg>
                ),
                title: "Shadow into Sovereignty",
                desc: "A system for transmuting what has blocked you into the exact credibility that makes you irreplaceable.",
              },
              {
                icon: (
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ color: "var(--gold)" }}>
                    <polygon points="26,4 48,17 48,35 26,48 4,35 4,17" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <polygon points="26,14 38,21 38,31 26,38 14,31 14,21" stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="round" opacity="0.5"/>
                    <circle cx="26" cy="26" r="3" fill="currentColor"/>
                    <line x1="26" y1="4" x2="26" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                    <line x1="26" y1="38" x2="26" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                    <line x1="4" y1="17" x2="14" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                    <line x1="38" y1="31" x2="48" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                    <line x1="48" y1="17" x2="38" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                    <line x1="14" y1="31" x2="4" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                  </svg>
                ),
                title: "Business Structure That Fits Your Soul",
                desc: "Offers, pricing, and systems designed around your genius — not someone else\u2019s template.",
              },
              {
                icon: (
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ color: "var(--gold)" }}>
                    <path d="M4 34 Q26 10 48 34" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <line x1="4" y1="36" x2="48" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="26" y1="22" x2="26" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="14" y1="25" x2="11" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="38" y1="25" x2="41" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="26" cy="34" r="2.5" fill="currentColor"/>
                  </svg>
                ),
                title: "Daily Habits That Hold",
                desc: "Practices calibrated to your nervous system so you can sustain the level you\u2019re stepping into.",
              },
              {
                icon: (
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ color: "var(--gold)" }}>
                    <circle cx="26" cy="14" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="36" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="40" cy="36" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="21" y1="18" x2="15" y2="31" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
                    <line x1="31" y1="18" x2="37" y2="31" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
                    <line x1="17" y1="36" x2="35" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Tribe by Design",
                desc: "A matched community of co-creators who refuse to let you shrink, and grow faster because of you.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "28px 28px",
                  border: "1px solid var(--ash-dark)",
                  borderRadius: 2,
                  transition: "border-color 0.3s",
                }}
              >
                <div style={{ marginBottom: 20 }}>{icon}</div>
                <p style={{
                  fontFamily: "var(--font-heading-stack)",
                  fontSize: 20,
                  fontWeight: 400,
                  color: "var(--parchment)",
                  marginBottom: 10,
                }}>
                  {title}
                </p>
                <p style={{
                  fontSize: 15,
                  color: "rgba(247, 243, 236, 0.75)",
                  lineHeight: 1.65,
                }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
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
                  fontSize: 32,
                  fontWeight: 400,
                  color: "var(--parchment)",
                  marginBottom: 24,
                  lineHeight: 1.3,
                }}
              >
                The Missing System for Purpose-Driven Leaders
              </p>
              <p style={{ color: "rgba(247, 243, 236, 0.9)", fontSize: 19, lineHeight: 1.75, marginBottom: 28 }}>
                After ten years guiding purpose-driven entrepreneurs, I kept running into the same
                wall. The inner work was profound. The gifts were real. But there was no single place
                that could hold identity and strategy, shadow and structure, morning practice and
                monetization — all calibrated to the way a transformational leader actually thinks
                and feels. Every tool on the market was built for marketers. Not for you.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-heading-stack)",
                  fontStyle: "italic",
                  fontSize: 22,
                  color: "var(--gold)",
                  lineHeight: 1.5,
                }}
              >
                Serafina is the answer to the question I have been asking for ten years: what would
                it look like if the technology actually understood the human using it?
              </p>
              <div style={{ marginTop: 28 }}>
                <button
                  onClick={openModal}
                  className="btn btn-large"
                  style={{ display: "inline-block" }}
                >
                  Enter the 7-Day ARISE Challenge &mdash; Free
                </button>
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
              ["◉", "Your Frequency", "The felt sense of your highest self \u2014 activated in your body, not just your mind."],
              ["✧", "Your Genius Statement", "The 1-2 sentence distillation of the transformation only you can deliver."],
              ["△", "Your Co-Creator Pod", "A matched tribe of builders at your level \u2014 people who see your fire and refuse to let you shrink."],
              ["⊕", "Your Identity Declarations", "5 present-tense statements about who you are becoming \u2014 anchored somatically."],
              ["↑", "Your First Piece of Content", "Something real, shared with a real audience. The ice is broken forever."],
              ["≋", "Your Regulation Practice", "A nervous system protocol for YOUR wiring \u2014 so you can hold the wealth, visibility, and impact that\u2019s coming."],
              ["∞", "Hands-On Serafina Experience", "You will have used the platform no one else has seen \u2014 and your feedback will shape its future."],
            ].map(([icon, title, desc], i) => (
              <div
                key={i}
                className="outcome-card fade-in"
                data-stagger
                style={i === 6 ? { borderColor: "var(--gold-dark)" } : undefined}
              >
                <div className="outcome-header">
                  <div className="symbol">{icon}</div>
                  <h4>{title}</h4>
                </div>
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
          Starts Tuesday, April 21, 2026 &middot; Zero cost, full commitment
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
          <a href="/privacy">Privacy</a> <a href="/terms">Terms</a> <a href="mailto:goldenpath@aurealeaders.com">Contact</a>
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

"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";

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

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setName("");
        setEmail("");
        setPhone("");
        setStatus("idle");
        setErrorMsg("");
      }, 300);
    }
  }, [isOpen]);

  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
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
                fontFamily: "var(--font-heading)",
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
            <h3>Join the ARISE Challenge</h3>
            <p className="modal-sub">
              7 days. Free. Live coaching. First access to Seraph.
            </p>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your best email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
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
            {status === "error" && <p className="error-msg">{errorMsg}</p>}
            <p
              style={{
                fontSize: 12,
                color: "var(--ash)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              Starts Monday, April 20, 2026 &middot; Zero cost, full commitment
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <div className="faq-q" onClick={() => setOpen(!open)}>
        <span dangerouslySetInnerHTML={{ __html: question }} />
        <span className="toggle">+</span>
      </div>
      <div className="faq-a">{answer}</div>
    </div>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <RegistrationModal isOpen={modalOpen} onClose={closeModal} />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div style={{ marginBottom: 40 }}>
          <img src="/aurea-logo.png" alt="AUREA" style={{ height: 120, width: "auto" }} />
        </div>
        <p className="eyebrow">
          Free 7-Day Breakthrough Experience &middot; Launching Monday, April 20, 2026
        </p>

        <div
          className="hero-grid-50"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
            maxWidth: 1080,
            width: "100%",
            margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <h1 style={{ textAlign: "left" }}>
              7 Days to Clear What&rsquo;s Blocking You, Build What&rsquo;s Calling You, and
              Get <em>the Tribe and Technology to Sustain It</em>
            </h1>
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              background: "var(--ash-dark)",
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid var(--ash-dark)",
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
                  cursor: "pointer",
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
                Watch &amp; Join the Challenge
              </p>
            </div>
          </div>
        </div>

        <p
          className="arena-line"
          style={{ maxWidth: 640, fontSize: 17, lineHeight: 1.65, margin: "36px auto 20px" }}
        >
          For those who sense it&rsquo;s not just their shadow holding them back &mdash; but the
          full light of who they&rsquo;re here to become.
        </p>
        <div style={{ margin: "0 0 20px" }}>
          <button onClick={openModal} className="btn btn-large">
            Yes, I&rsquo;m Ready for a Breakthrough
          </button>
        </div>
        <p style={{ fontSize: 13, letterSpacing: ".06em", color: "var(--ash)" }}>
          Live Coaching &middot; Daily Somatic Meditations &middot; First Access to{" "}
          <strong style={{ color: "var(--gold)" }}>Seraph</strong> &mdash; the AI Platform Built
          for Transformation Leaders
        </p>

        {/* What You Get Snapshot */}
        <div style={{ margin: "0 auto 40px", maxWidth: 820, width: "100%" }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".22em",
              color: "var(--gold-dark)",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            In 7 Days, You Will Have
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {[
              ["An Experience of", "Your Highest Self"],
              ["An Aligned Offer", "From Your Truth"],
              ["A 30-Day Roadmap", "to $10,000"],
            ].map(([l1, l2], i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  minWidth: 220,
                  maxWidth: 260,
                  border: "1px solid var(--ash-dark)",
                  borderRadius: 2,
                  padding: "24px 20px",
                  textAlign: "center",
                  transition: "border-color 0.3s",
                }}
              >
                <div style={{ color: "var(--gold)", fontSize: 20, marginBottom: 10 }}>&#10022;</div>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 18,
                    fontWeight: 400,
                    color: "var(--parchment)",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {l1}
                  <br />
                  {l2}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bonus */}
        <div style={{ margin: "8px auto 0", maxWidth: 620, textAlign: "center" }}>
          <div
            style={{
              border: "1px solid var(--gold-dark)",
              borderRadius: 2,
              padding: "16px 28px",
              background: "rgba(201, 168, 76, 0.04)",
              display: "inline-block",
            }}
          >
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: ".2em",
                color: "var(--gold)",
                marginBottom: 4,
              }}
            >
              Bonus
            </p>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 18,
                fontWeight: 400,
                color: "var(--parchment)",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              First Access to the AUREA Seraph Ecosystem
              <br />
              <span
                style={{
                  fontSize: 13,
                  color: "var(--gold-dark)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                }}
              >
                The AI Platform Built for Transformation Leaders
              </span>
            </p>
          </div>
        </div>

        {/* Credibility */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#C9A84C">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--ash)", letterSpacing: ".05em" }}>
            5.0 on Google &middot; Trusted by 1,000+ coaches and entrepreneurs
          </p>
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
              <span key={i} className="ticker-item">
                {quote} &mdash; <span className="name">{name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== THREE BLOCKS ===== */}
      <section className="blocks section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow text-center">What&rsquo;s Actually In Your Way</p>
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
            <div className="block-card">
              <div className="block-num">Block One</div>
              <h3>Frequency</h3>
              <p>
                You know intellectually that you&rsquo;re gifted. But you cannot consistently access
                the <em>feeling</em> of your own greatness. Without that felt sense alive in your
                body, every offer you build, every piece of content you create, every price you set
                comes from a contracted version of you &mdash; not the sovereign one. The strategy
                doesn&rsquo;t work until the frequency is right.
              </p>
            </div>
            <div className="block-card">
              <div className="block-num">Block Two</div>
              <h3>Tribe</h3>
              <p>
                You are building alone. And somewhere in your nervous system lives a primal fear:
                that if you fully become who you are, you will be ostracized. Persecuted for being
                different. Abandoned by the people you love. This fear keeps you small. It only
                dissolves in the presence of co-creators who see your fire &mdash; and match it. You
                need a tribe that makes expansion feel safe.
              </p>
            </div>
            <div className="block-card" style={{ borderColor: "var(--gold-dark)" }}>
              <div className="block-num">Block Three</div>
              <h3>Technology</h3>
              <p>
                AI is rewriting the rules of business in real time. You know it matters. You
                don&rsquo;t know how to use it. The tools were built for marketers and growth hackers
                &mdash; not for people who think in transformation. So we built something different:{" "}
                <strong style={{ color: "var(--gold-light)" }}>Seraph</strong> &mdash; an AI
                operating system with a soul-aligned guide, personalized morning activations, tribe
                matching based on your actual design, offer building, and daily command center. All
                built for YOUR kind of work. During ARISE, you experience it first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="problem section-pad fade-in">
        <div className="content">
          <div className="lines">
            You <strong>KNOW</strong> you are meant to lead.
            <br />
            You <strong>KNOW</strong> your story could change lives.
            <br />
            You <strong>KNOW</strong> there are people out there who need exactly what you carry.
            <br /><br />
            <em>And yet &mdash;</em>
            <br /><br />
            You can&rsquo;t access the <strong>feeling</strong> of your own greatness long enough to
            build from it.
            <br />
            You are <strong>alone</strong> &mdash; without a tribe of co-creators who see your fire
            and refuse to let you shrink.
            <br />
            You are <strong>overwhelmed</strong> by technology that was built for marketers, not for
            people who think in transformation.
            <br /><br />
            And underneath all of it &mdash; a deeper knowing you can&rsquo;t shake:
            <br /><br />
            <strong>Something is being revealed in the world right now.</strong>
            <br />
            Darkness that has been hidden for generations is surfacing.
            <br />
            In systems. In institutions. In the people we were told to trust.
            <br />
            And it is not random. It is a mirror.
            <br /><br />
            What is being exposed out there is the same shadow
            <br />
            that lives in here &mdash; in your patterns, your fears,
            <br />
            your reasons for staying small.
            <br /><br />
            The question is not <em>why is this happening.</em>
            <br />
            The question is <em>what is it activating in you?</em>
            <br /><br />
            Not because you&rsquo;re not ready.
            <br />
            Because no one gave you the bridge between your transformation
            <br />
            and the business that should exist around it.
          </div>
          <p className="bridge">This is that bridge.</p>
          <p className="bridge-sub">7 days. Free. Everything changes.</p>
          <button onClick={openModal} className="btn">
            I&rsquo;m Ready &mdash; Save My Spot
          </button>
        </div>
      </section>

      {/* ===== GUIDE ===== */}
      <section className="guide section-pad">
        <div className="container-wide">
          <p className="eyebrow text-center">Your Guide</p>
          <div className="guide-grid">
            <div className="guide-photo">[ Jackson Strong Photo ]</div>
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

          <div className="testimonials-row fade-in">
            <div className="test-card">
              <p className="quote">
                &ldquo;Jackson&rsquo;s guidance has been nothing short of transformative. His unique
                blend of expertise and compassion empowered me to step into my true potential.&rdquo;
              </p>
              <p className="attr">&mdash; Lakia Meadan</p>
              <p className="attr-org">Sacred Earth Travels</p>
            </div>
            <div className="test-card">
              <p className="quote">
                &ldquo;It&rsquo;s truly a deep dive into your soul&rsquo;s purpose. Being in a group
                container with Jackson and other vibrant souls is so expansive. 11 out of 10!&rdquo;
              </p>
              <p className="attr">&mdash; Daniela Sardi &amp; Tyler Schraeder</p>
              <p className="attr-org">Stage Secrets Alumni</p>
            </div>
            <div className="test-card">
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
          <p className="eyebrow text-center">The 7-Day Journey</p>
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
              Join the Challenge &mdash; Free
            </button>
          </div>
        </div>
      </section>

      {/* ===== SERAPH SECTION ===== */}
      <section className="seraph section-pad fade-in">
        <div className="container-wide">
          <p className="eyebrow text-center" style={{ color: "var(--gold)" }}>
            Introducing Seraph
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 300,
              fontSize: "clamp(28px, 4vw, 42px)",
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
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--gold-dark)",
              marginBottom: 56,
            }}
          >
            During ARISE, you experience it first. Your feedback shapes what it becomes.
          </p>

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
                style={{
                  border: "1px solid var(--ash-dark)",
                  borderRadius: 2,
                  padding: "32px 24px",
                  transition: "border-color 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--gold-dark)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--ash-dark)")}
              >
                <p style={{ fontSize: 24, marginBottom: 12 }}>{item.icon}</p>
                <h4
                  style={{
                    fontFamily: "var(--font-heading)",
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
                  fontFamily: "var(--font-heading)",
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
                  fontFamily: "var(--font-heading)",
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
          <p className="eyebrow text-center">After 7 Days, You Will Have</p>
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
                className="outcome-card"
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
          <p className="eyebrow text-center">The Alchemy</p>
          <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
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
                  fontFamily: "var(--font-heading)",
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
                  fontFamily: "var(--font-heading)",
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
                fontFamily: "var(--font-heading)",
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
          <p className="eyebrow text-center">Is This For You?</p>
          <div className="who-grid">
            <div className="who-col yes">
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
            <div className="who-col no">
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
          Join the Challenge &mdash; Free
        </button>
        <p className="details">
          Starts Monday, April 20, 2026 &middot; Zero cost, full commitment
        </p>
        <p className="closing-quote">
          &ldquo;The hero inside you is not waiting for the fear to pass. They are waiting for you to
          move anyway. That is the alchemy. That is the call. ARISE.&rdquo;
        </p>
      </section>

      <footer>
        <div className="logo">
          <img src="/aurea-logo.png" alt="AUREA" style={{ height: 60, width: "auto" }} />
        </div>
        <p>
          <a href="#">Privacy</a> <a href="#">Terms</a> <a href="#">Contact</a>
        </p>
        <p style={{ marginTop: 12 }}>
          &copy; 2026 Aurea Leaders. All rights reserved.
          <br />
          Architected for the Golden Age.
        </p>
      </footer>
    </>
  );
}

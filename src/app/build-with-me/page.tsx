"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  email: string;
  phone: string;
  timezone: string;
  bio: string;
  draining: string;
  stuck: string;
  alive: string;
  cost: string;
  story: string;
  next_version: string;
  message: string;
  dream_tuesday: string;
  ideal_person: string;
  survived: string;
  website: string;
  business_name: string;
  entity: string;
  offers: string;
  brand_assets_have: string[];
  brand_assets_need: string;
  ideal_client: string;
  revenue: string;
  didnt_deliver: string;
  lost_faith: string;
  need_to_see: string;
  right_feels: string;
  never_asked: string;
  want_to_hear: string;
  anything_else: string;
  season_word: string;
  consent_email: boolean;
  consent_phone: boolean;
  website_hp: string;
};

const STORAGE_KEY = "build-with-me-draft-v1";
const AUTOSAVE_MS = 30000;

const INITIAL: FormData = {
  name: "", email: "", phone: "", timezone: "", bio: "",
  draining: "", stuck: "", alive: "", cost: "", story: "",
  next_version: "", message: "", dream_tuesday: "", ideal_person: "", survived: "",
  website: "", business_name: "", entity: "", offers: "",
  brand_assets_have: [], brand_assets_need: "", ideal_client: "", revenue: "",
  didnt_deliver: "", lost_faith: "", need_to_see: "", right_feels: "", never_asked: "", want_to_hear: "",
  anything_else: "", season_word: "", consent_email: false, consent_phone: false,
  website_hp: "",
};

const TIMEZONES = [
  "Pacific (PT)", "Mountain (MT)", "Central (CT)", "Eastern (ET)",
  "Alaska (AKT)", "Hawaii (HT)", "UTC", "London (GMT)", "Paris (CET)",
  "Dubai (GST)", "Singapore (SGT)", "Tokyo (JST)", "Sydney (AEDT)", "Other",
];

const ENTITIES = ["LLC", "S-Corp", "C-Corp", "Sole Prop", "Not yet formed", "Other"];

const REVENUE = [
  "Under $2k/mo", "$2–10k/mo", "$10–25k/mo", "$25–50k/mo",
  "$50–100k/mo", "$100k+/mo", "Prefer not to say",
];

const BRAND_ASSETS = [
  "Logo", "Photos", "Color palette", "Voice guide",
  "Website", "Email list", "Social presence", "Other",
];

export default function BuildWithMePage() {
  const router = useRouter();
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({ ...INITIAL, ...parsed });
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSavedAt(Date.now());
      } catch {}
    }, AUTOSAVE_MS);
    return () => clearInterval(id);
  }, [data, loaded]);

  function update<K extends keyof FormData>(k: K, v: FormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function toggleAsset(asset: string) {
    setData((d) => ({
      ...d,
      brand_assets_have: d.brand_assets_have.includes(asset)
        ? d.brand_assets_have.filter((a) => a !== asset)
        : [...d.brand_assets_have, asset],
    }));
  }

  function scrollToFirst() {
    document.getElementById("section-1")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (data.website_hp) return;
    if (!data.name || !data.email || !data.phone || !data.timezone || !data.bio) {
      setError("Please complete the 'You, arriving' section before sending.");
      document.getElementById("section-1")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/build-with-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Something went wrong." }));
        throw new Error(err.error || "Submission failed.");
      }
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      router.push("/build-with-me/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main style={{ background: "var(--ink)", minHeight: "100vh", color: "var(--parchment)" }}>
      <form onSubmit={submit} noValidate>
        {/* OPENING LETTER */}
        <section style={{ padding: "120px 24px 80px", maxWidth: 680, margin: "0 auto" }}>
          <p className="eyebrow" style={{ textAlign: "center", marginBottom: 32, color: "var(--gold-dark)" }}>
            After ARISE · A Letter from Jackson
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
            <p style={{ marginBottom: 24 }}>You just finished seven days with me. Thank you!</p>
            <p style={{ marginBottom: 24 }}>I don&rsquo;t take that lightly — your time, your honesty, the things you let yourself (and us) see.</p>
            <p style={{ marginBottom: 24 }}>Now the real work begins&hellip; the part where what you felt in the room becomes the thing you actually build.</p>
            <p style={{ marginBottom: 40 }}>What is the dream in your heart? What are you desiring to build that you see the world needs?</p>

            <p style={{ marginBottom: 24 }}>I&rsquo;ve been building transformational coaching work for nearly 10 years. I&rsquo;ve watched rooms change people&rsquo;s lives. I&rsquo;ve also watched rooms promise everything and deliver a PDF and a Slack group.</p>
            <p style={{ marginBottom: 24 }}>I&rsquo;m done with both extremes.</p>
            <p style={{ marginBottom: 40 }}>This time I&rsquo;m building differently — and the container I build next has to be shaped by what you actually need, not by what I think I know.</p>

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
              The more honest you are, the more precisely I can build something that actually serves you.
            </blockquote>

            <p style={{ marginBottom: 24 }}>I&rsquo;m not going to pretend I know what you need. I&rsquo;ve been doing this long enough to know the answer isn&rsquo;t inside my head. It&rsquo;s inside your life — what you&rsquo;ve tried, what&rsquo;s still aching, what you&rsquo;d actually pay for if it were real.</p>
            <p style={{ marginBottom: 24 }}>This isn&rsquo;t a form. It&rsquo;s the beginning of a conversation.</p>
            <p style={{ marginBottom: 48 }}>Take as long as you need. No timer. No wrong answers. I&rsquo;ll read every word myself, and come back to you directly with something built for what you actually need.</p>

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
              onClick={scrollToFirst}
              className="btn btn-large"
              style={{ boxShadow: "0 0 40px rgba(201, 168, 76, 0.08)" }}
            >
              Begin
            </button>
          </div>
        </section>

        {/* Divider into survey */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          maxWidth: 420,
          margin: "40px auto 0",
          padding: "0 24px",
        }} aria-hidden="true">
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--gold-dark))" }} />
          <div style={{ color: "var(--gold)", fontSize: 18 }}>&#10022;</div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--gold-dark), transparent)" }} />
        </div>

        {/* SECTION 1 */}
        <Section id="section-1" numeral="I" title="You, arriving">
          <Field label="Name" required>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              style={inputStyle}
              required
            />
          </Field>
          <Field label="Email" required>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              style={inputStyle}
              required
            />
          </Field>
          <Field label="Phone" required>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              style={inputStyle}
              required
            />
          </Field>
          <Field label="Time zone" required>
            <select
              value={data.timezone}
              onChange={(e) => update("timezone", e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">Select…</option>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </Field>
          <Field label="One sentence: who are you, and what are you building?" required>
            <input
              type="text"
              value={data.bio}
              onChange={(e) => update("bio", e.target.value)}
              style={inputStyle}
              required
            />
          </Field>
        </Section>

        {/* SECTION 2 */}
        <Section id="section-2" numeral="II" title="The signal">
          <Prompt
            q="What’s been draining you most in the last 90 days?"
            value={data.draining}
            onChange={(v) => update("draining", v)}
          />
          <Prompt
            q="What are you most stuck on right now — the thing you think about in the shower, or at 2am?"
            value={data.stuck}
            onChange={(v) => update("stuck", v)}
          />
          <Prompt
            q="When was the last time you felt truly alive in your work? What were you doing?"
            value={data.alive}
            onChange={(v) => update("alive", v)}
          />
          <Prompt
            q="If nothing changed in the next 6 months, what would it cost you — in your work, your body, your relationships?"
            value={data.cost}
            onChange={(v) => update("cost", v)}
          />
          <Prompt
            q="What’s the story you tell yourself about why it hasn’t shifted yet?"
            value={data.story}
            onChange={(v) => update("story", v)}
          />
        </Section>

        {/* SECTION 3 */}
        <Section id="section-3" numeral="III" title="The calling">
          <Prompt
            q="When you imagine the next version of your life and business, what does it actually look like?"
            value={data.next_version}
            onChange={(v) => update("next_version", v)}
          />
          <Prompt
            q="What’s the message, movement, or work you’re here to bring — even if you can’t say it cleanly yet?"
            value={data.message}
            onChange={(v) => update("message", v)}
          />
          <Prompt
            q="If you had your dream week — 60%+ of your hours in your Zone of Genius — what would Tuesday morning look like?"
            value={data.dream_tuesday}
            onChange={(v) => update("dream_tuesday", v)}
          />
          <Prompt
            q="Who is the person you can most clearly see needing your work? Describe them."
            value={data.ideal_person}
            onChange={(v) => update("ideal_person", v)}
          />
          <Prompt
            q="What did you survive that made you the person who could help others survive it?"
            value={data.survived}
            onChange={(v) => update("survived", v)}
          />
        </Section>

        {/* SECTION 4 */}
        <Section id="section-4" numeral="IV" title="The vessel">
          <Field label="Current website URL">
            <input
              type="url"
              value={data.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://"
              style={inputStyle}
            />
          </Field>
          <Field label="Business name">
            <input
              type="text"
              value={data.business_name}
              onChange={(e) => update("business_name", e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Entity type">
            <select
              value={data.entity}
              onChange={(e) => update("entity", e.target.value)}
              style={inputStyle}
            >
              <option value="">Select…</option>
              {ENTITIES.map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Prompt
            q="Current offers you run"
            value={data.offers}
            onChange={(v) => update("offers", v)}
          />
          <Field label="Brand assets you already have">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
              {BRAND_ASSETS.map((asset) => {
                const checked = data.brand_assets_have.includes(asset);
                return (
                  <label
                    key={asset}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 18px",
                      border: `1px solid ${checked ? "var(--gold)" : "var(--ash-dark)"}`,
                      background: checked ? "rgba(201, 168, 76, 0.12)" : "transparent",
                      color: checked ? "var(--gold)" : "var(--parchment)",
                      borderRadius: 2,
                      cursor: "pointer",
                      fontSize: 14,
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAsset(asset)}
                      style={{ accentColor: "var(--gold)" }}
                    />
                    {asset}
                  </label>
                );
              })}
            </div>
          </Field>
          <Prompt
            q="Brand assets you know you need"
            value={data.brand_assets_need}
            onChange={(v) => update("brand_assets_need", v)}
          />
          <Prompt
            q="Ideal client — demographics AND the less visible stuff (what keeps them up, what they’re longing for)"
            value={data.ideal_client}
            onChange={(v) => update("ideal_client", v)}
          />
          <Field
            label="Current monthly revenue range"
            hint="Helps us calibrate, not qualify."
          >
            <select
              value={data.revenue}
              onChange={(e) => update("revenue", e.target.value)}
              style={inputStyle}
            >
              <option value="">Select…</option>
              {REVENUE.map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </Field>
        </Section>

        {/* SECTION 5 */}
        <Section id="section-5" numeral="V" title="The truth about what’s been sold to you">
          <Prompt
            q="What have you invested in before — courses, coaches, masterminds, programs — that didn’t deliver? What specifically went wrong?"
            value={data.didnt_deliver}
            onChange={(v) => update("didnt_deliver", v)}
          />
          <Prompt
            q="What’s been promised to you by other teachers that you’ve quietly lost faith in?"
            value={data.lost_faith}
            onChange={(v) => update("lost_faith", v)}
          />
          <Prompt
            q="What would you need to see, hear, or feel to trust that someone is actually building differently this time?"
            value={data.need_to_see}
            onChange={(v) => update("need_to_see", v)}
          />
          <Prompt
            q="When you imagine saying yes to the right container for this next chapter, what does &ldquo;right&rdquo; feel like in your body — before you even know the details?"
            value={data.right_feels}
            onChange={(v) => update("right_feels", v)}
          />
          <Prompt
            q="What’s one thing no coach or program has ever asked you that you wish they had?"
            value={data.never_asked}
            onChange={(v) => update("never_asked", v)}
          />
          <Field label="If we built a container that addressed everything you just said, would you want to hear about it first?">
            <select
              value={data.want_to_hear}
              onChange={(e) => update("want_to_hear", e.target.value)}
              style={inputStyle}
            >
              <option value="">Select…</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </Field>
        </Section>

        {/* SECTION 6 */}
        <Section id="section-6" numeral="VI" title="Your sealing">
          <Prompt
            q="Anything else you want us to know?"
            value={data.anything_else}
            onChange={(v) => update("anything_else", v)}
          />
          <Field label="One word for the season you’re in right now.">
            <input
              type="text"
              value={data.season_word}
              onChange={(e) => update("season_word", e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Consent to follow up">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 15 }}>
                <input
                  type="checkbox"
                  checked={data.consent_email}
                  onChange={(e) => update("consent_email", e.target.checked)}
                  style={{ accentColor: "var(--gold)" }}
                />
                Email is OK
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 15 }}>
                <input
                  type="checkbox"
                  checked={data.consent_phone}
                  onChange={(e) => update("consent_phone", e.target.checked)}
                  style={{ accentColor: "var(--gold)" }}
                />
                Phone is OK
              </label>
            </div>
          </Field>
        </Section>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={data.website_hp}
          onChange={(e) => update("website_hp", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none", height: 0, width: 0 }}
        />

        {/* SUBMIT */}
        <section style={{ padding: "80px 24px 160px", maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          {error && (
            <p style={{
              color: "var(--error)",
              marginBottom: 32,
              fontSize: 15,
              fontFamily: "var(--font-body-stack)",
            }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-large"
            style={{ opacity: submitting ? 0.55 : 1, minWidth: 260 }}
          >
            {submitting ? "Sending…" : "Send it to Jackson"}
          </button>
          {savedAt && !submitting && (
            <p style={{
              fontSize: 12,
              color: "var(--ash)",
              marginTop: 24,
              letterSpacing: "0.08em",
            }}>
              Your draft is saved on this device.
            </p>
          )}
        </section>
      </form>
    </main>
  );
}

// ———————————— components ————————————

function Section({
  id, numeral, title, children,
}: {
  id: string;
  numeral: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        padding: "120px 24px 100px",
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 72, textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: 24,
          color: "var(--gold)",
          letterSpacing: "0.3em",
          marginBottom: 16,
          fontWeight: 400,
        }}>
          {numeral}
        </p>
        <div
          aria-hidden="true"
          style={{
            width: 48,
            height: 1,
            background: "var(--gold-dark)",
            margin: "0 auto 28px",
          }}
        />
        <h2 style={{
          fontFamily: "var(--font-heading-stack)",
          fontSize: "clamp(34px, 5vw, 48px)",
          fontWeight: 300,
          color: "var(--parchment)",
          lineHeight: 1.15,
          letterSpacing: "-0.015em",
        }}>
          {title}
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
        {children}
      </div>
    </section>
  );
}

function Field({
  label, hint, required, children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{
        display: "block",
        fontFamily: "var(--font-body-stack)",
        fontSize: 14,
        color: "rgba(247, 243, 236, 0.72)",
        letterSpacing: "0.04em",
        marginBottom: 10,
      }}>
        {label}{required && <span style={{ color: "var(--gold-dark)", marginLeft: 4 }}>*</span>}
      </span>
      {children}
      {hint && (
        <span style={{
          display: "block",
          fontSize: 12,
          color: "var(--ash)",
          marginTop: 8,
          fontStyle: "italic",
        }}>
          {hint}
        </span>
      )}
    </label>
  );
}

function Prompt({
  q, value, onChange,
}: {
  q: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div>
      <p style={{
        fontFamily: "var(--font-heading-stack)",
        fontSize: 21,
        lineHeight: 1.4,
        color: "var(--parchment)",
        marginBottom: 20,
        fontWeight: 400,
      }}
        dangerouslySetInnerHTML={{ __html: q }}
      />
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        style={{
          ...inputStyle,
          resize: "none",
          minHeight: 96,
          lineHeight: 1.7,
          fontFamily: "var(--font-body-stack)",
        }}
      />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  background: "rgba(247, 243, 236, 0.04)",
  border: "1px solid var(--ash-dark)",
  borderRadius: 2,
  color: "var(--parchment)",
  fontFamily: "var(--font-body-stack)",
  fontSize: 16,
  lineHeight: 1.6,
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
};

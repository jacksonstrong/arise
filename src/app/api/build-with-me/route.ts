import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type SubmissionBody = Record<string, unknown>;

export async function POST(req: NextRequest) {
  let body: SubmissionBody;
  try {
    body = (await req.json()) as SubmissionBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.website_hp === "string" && body.website_hp.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const required = ["name", "email", "phone", "timezone", "bio"] as const;
  for (const key of required) {
    if (typeof body[key] !== "string" || !(body[key] as string).trim()) {
      return NextResponse.json(
        { error: "Please complete the required fields in 'You, arriving'." },
        { status: 400 }
      );
    }
  }

  const email = (body.email as string).trim();
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const timestamp = new Date().toISOString();

  const { website_hp: _hp, ...cleanBody } = body;
  void _hp;

  const payload = {
    ...cleanBody,
    _meta: { timestamp, ip, user_agent: userAgent, source: "build-with-me" },
  };

  const apiKey = process.env.ADHARA_API_KEY;
  const formSlug = process.env.ADHARA_FORM_SLUG_BUILD_WITH_ME;
  const apiUrl = process.env.ADHARA_API_URL;
  const sheetsWebhook = process.env.SHEETS_WEBHOOK_URL;

  const destinations: Promise<unknown>[] = [];

  if (apiKey && formSlug && apiUrl) {
    destinations.push(
      fetch(`${apiUrl}/api/v1/forms/${formSlug}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          response_data: payload,
          source_url: req.headers.get("referer") || undefined,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errText = await res.text();
            console.error("[build-with-me] Adhara API error:", res.status, errText);
          }
        })
        .catch((err) => {
          console.error("[build-with-me] Adhara API exception:", err);
        })
    );
  }

  if (sheetsWebhook) {
    destinations.push(
      fetch(sheetsWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errText = await res.text();
            console.error("[build-with-me] Sheets webhook error:", res.status, errText);
          }
        })
        .catch((err) => {
          console.error("[build-with-me] Sheets webhook exception:", err);
        })
    );
  }

  if (destinations.length === 0) {
    console.log("[build-with-me] No destinations configured — logging submission locally:");
    console.log(JSON.stringify(payload, null, 2));
  } else {
    await Promise.allSettled(destinations);
  }

  return NextResponse.json({ success: true });
}

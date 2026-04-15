import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  const { name, email, phone } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const apiKey = process.env.ADHARA_API_KEY;
  const formSlug = process.env.ADHARA_FORM_SLUG;
  const apiUrl = process.env.ADHARA_API_URL;

  if (!apiKey || !formSlug || !apiUrl) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const res = await fetch(`${apiUrl}/api/v1/forms/${formSlug}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      response_data: {
        "field-name": name,
        "field-email": email,
        ...(phone ? { "field-phone": phone } : {}),
      },
      source_url: req.headers.get("referer") || undefined,
    }),
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error("Adhara API error:", res.status, errorData);

    if (res.status === 422) {
      try {
        const parsed = JSON.parse(errorData) as {
          detail?: { field?: string; error_code?: string; message?: string };
        };
        const code = parsed.detail?.error_code;
        const field = parsed.detail?.field;
        if (field === "email" && (code === "invalid_domain" || code === "invalid_format")) {
          return NextResponse.json(
            { error: "Please enter a valid email address." },
            { status: 400 }
          );
        }
        if (field === "email" && (code === "duplicate" || code === "already_registered" || code === "duplicate_email")) {
          return NextResponse.json(
            { error: "This email has already registered." },
            { status: 409 }
          );
        }
        if (parsed.detail?.message) {
          return NextResponse.json(
            { error: parsed.detail.message },
            { status: 400 }
          );
        }
      } catch {
        // fall through to generic error
      }
    }

    return NextResponse.json(
      { error: "Failed to submit registration" },
      { status: 500 }
    );
  }

  const data = (await res.json()) as { id?: string; is_duplicate?: boolean };

  if (data.is_duplicate) {
    return NextResponse.json(
      { error: "This email has already registered." },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true, id: data.id });
}

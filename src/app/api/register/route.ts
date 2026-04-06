import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, phone } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
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
    return NextResponse.json(
      { error: "Failed to submit registration" },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json({ success: true, id: data.id });
}

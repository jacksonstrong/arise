import { NextResponse } from "next/server";

export async function GET() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AUREA Leaders//ARISE Challenge//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:arise-challenge-2026@aurealeaders.com",
    "SUMMARY:ARISE Challenge",
    "DESCRIPTION:Join us live via Zoom:\\nhttps://us06web.zoom.us/j/5608769933?pwd=V2o1ZTNXL3VMaENEVmhuYnJFTjdpZz09\\n\\nThe 7-day ARISE Challenge. Be there live each night.",
    "LOCATION:https://us06web.zoom.us/j/5608769933?pwd=V2o1ZTNXL3VMaENEVmhuYnJFTjdpZz09",
    "DTSTART;TZID=America/Chicago:20260421T190000",
    "DTEND;TZID=America/Chicago:20260421T210000",
    "RRULE:FREQ=DAILY;COUNT=7",
    "ORGANIZER;CN=Jackson Strong:mailto:jackson@aurealeaders.com",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:ARISE Challenge starts in 1 hour",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="arise-challenge.ics"',
    },
  });
}

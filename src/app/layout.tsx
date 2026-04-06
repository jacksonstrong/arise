import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARISE — 7 Days to Clear, Build, and Sustain | AUREA Leaders",
  description:
    "Free 7-day challenge for coaches, healers, speakers, and thought leaders. Break through the 3 blocks to your mission — and get first access to Seraph, the AI platform built for transformation leaders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

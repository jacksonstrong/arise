import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-heading",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "ARISE — 7 Days to Clear, Build, and Sustain | AUREA Leaders",
  description:
    "Free 7-day challenge for coaches, healers, speakers, and thought leaders. Break through the 3 blocks to your mission — and get first access to Serafina, the sovereign intelligence platform for Golden Age Leaders.",
  openGraph: {
    title: "ARISE — 7-Day Breakthrough Experience | AUREA Leaders",
    description: "Free 7-day challenge for coaches, healers, speakers, and thought leaders. Break through the 3 blocks to your mission.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARISE — 7-Day Breakthrough Experience | AUREA Leaders",
    description: "Free 7-day challenge for coaches, healers, speakers, and thought leaders.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`} style={{ scrollBehavior: "smooth" }}>
      <body>{children}</body>
    </html>
  );
}

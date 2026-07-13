import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { data } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// ~155-char SEO description trimmed from data.summary.
const SEO_DESCRIPTION =
  "Engineering student building intelligent, secure, connected systems — AI/ML, cybersecurity, full-stack MERN, and IoT. Internships at Accenture & Cisco.";

// DESIGN.md names Cabinet Grotesk / General Sans (Fontshare, not on Google). Space Grotesk
// 700 is the closest geometric-grotesk "HUD" face available via next/font without vendoring.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${data.name} — AI/ML · Cybersecurity · Full-Stack`,
  description: SEO_DESCRIPTION,
  openGraph: {
    title: `${data.name} — AI/ML · Cybersecurity · Full-Stack`,
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    siteName: `${data.name} — Portfolio`,
    type: "website",
    // og-image is auto-wired by app/opengraph-image.tsx (1200×630).
  },
  twitter: {
    card: "summary_large_image",
    title: `${data.name} — AI/ML · Cybersecurity · Full-Stack`,
    description: SEO_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#08060f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <a
          href="#experience"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ice focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-void"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { data } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// ~155-char SEO description trimmed from data.summary.
const SEO_DESCRIPTION =
  "Engineering student building intelligent, secure, connected systems — AI/ML, cybersecurity, full-stack MERN, and IoT. Internships at Accenture & Cisco.";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
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
  themeColor: "#0b0f14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plexMono.variable} ${plexSans.variable}`}>
      <body>
        <a
          href="#experience"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

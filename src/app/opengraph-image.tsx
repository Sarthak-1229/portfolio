import { ImageResponse } from "next/og";
import { data } from "@/lib/data";

export const runtime = "edge";
export const alt = `${data.name} — AI/ML · Cybersecurity · Full-Stack`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static hero card: dark bg, name in mono, role tagline, signal-cyan accent line.
export default async function OGImage() {
  const mono = await fetch(
    "https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-mono@5.0.13/files/ibm-plex-mono-latin-600-normal.woff"
  ).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0B0F14",
          padding: "90px",
          fontFamily: "IBM Plex Mono",
          position: "relative",
        }}
      >
        {/* top signal accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#4CC9F0",
          }}
        />
        <div style={{ display: "flex", color: "#8891A3", fontSize: 26, letterSpacing: 6 }}>
          PORTFOLIO
        </div>
        <div
          style={{
            display: "flex",
            color: "#E8EDF2",
            fontSize: 96,
            fontWeight: 600,
            marginTop: 18,
            letterSpacing: -2,
          }}
        >
          {data.name}
        </div>
        <div
          style={{
            display: "flex",
            width: 220,
            height: 4,
            background: "#4CC9F0",
            marginTop: 30,
            boxShadow: "0 0 24px #4CC9F0",
          }}
        />
        <div
          style={{
            display: "flex",
            color: "#4CC9F0",
            fontSize: 38,
            marginTop: 34,
            letterSpacing: 1,
          }}
        >
          AI/ML · Cybersecurity · Full-Stack
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "IBM Plex Mono", data: mono, weight: 600, style: "normal" }],
    }
  );
}

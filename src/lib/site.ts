// Canonical site origin. Override in Vercel via NEXT_PUBLIC_SITE_URL once the
// real domain is set; the vercel.app fallback keeps OG/sitemap valid meanwhile.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sarthak-bhosale.vercel.app";

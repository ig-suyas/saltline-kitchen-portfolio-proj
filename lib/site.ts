// Canonical origin. On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set automatically at build time.
// Set NEXT_PUBLIC_SITE_URL to override (e.g. a custom domain).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const SITE_NAME = "Saltline Kitchen";
export const SITE_DESCRIPTION =
  "Saltline Kitchen: wood-fired seafood in Red Hook, Greenpoint and Carroll Gardens, Brooklyn. A portfolio concept with menu, locations, reservations and a table-ordering demo.";

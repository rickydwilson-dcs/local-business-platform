// lib/site.ts
export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export function absUrl(pathOrUrl: string) {
  try {
    new URL(pathOrUrl);           // already absolute
    return pathOrUrl;
  } catch {
    return new URL(pathOrUrl, baseUrl).toString(); // resolve path → absolute
  }
}

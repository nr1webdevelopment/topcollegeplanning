/**
 * Wraps external image URLs through our server-side proxy so the browser
 * never directly hits hotlink-protected origins (Wikipedia CDN, etc.).
 *
 * Local paths (starting with /) are returned unchanged — they're already
 * served by Next.js from /public/.
 */
export function proxyImage(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('/')) return url // already local → no proxy needed
  if (!url.startsWith('http')) return url // relative or data: URI → pass through
  return `/api/proxy-image?url=${encodeURIComponent(url)}`
}

/**
 * Same as proxyImage but returns a fallback string instead of undefined
 * so it's safe to drop straight into src="".
 */
export function proxyImageSrc(url: string | null | undefined, fallback = ''): string {
  return proxyImage(url) ?? fallback
}

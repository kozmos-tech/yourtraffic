// Helpers for the ingest endpoint: visitor hashing, request parsing and keys.
// Everything here avoids storing anything that can identify a person.

const enc = new TextEncoder()

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// A salt that changes every day so visitor hashes cannot be linked across days.
// Derived from the server secret, so it is never stored and never predictable.
function dailySalt(): Promise<string> {
  const secret = process.env.BETTER_AUTH_SECRET || 'yourtraffic-dev-secret'
  const day = new Date().toISOString().slice(0, 10)
  return sha256(secret + '|' + day)
}

// Anonymous, non-reversible visitor id for a project, rotated daily.
export async function visitorHash(projectId: string, ip: string, ua: string): Promise<string> {
  const salt = await dailySalt()
  return sha256(salt + '|' + projectId + '|' + ip + '|' + ua)
}

// Bare hostname with a leading www stripped, so example.com and www.example.com
// map to the same project.
export function normalizeDomain(host: string): string {
  return host.toLowerCase().replace(/^www\./, '')
}

// The referring site's domain, or null for direct traffic and same-site clicks.
export function referrerHost(referrer: string | null | undefined, self: string): string | null {
  if (!referrer) return null
  try {
    const host = normalizeDomain(new URL(referrer).hostname)
    return host && host !== self ? host : null
  } catch {
    return null
  }
}

// First hop of x-forwarded-for, falling back to x-real-ip. Only ever hashed.
export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return headers.get('x-real-ip') || ''
}

// Two-letter country from the CDN, if present. Vercel and Cloudflare both set one.
export function country(headers: Headers): string | null {
  return headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || null
}

type Agent = { browser: string; os: string; device: string }

// Coarse user-agent parsing. We keep only the family, never the version, to stay
// privacy-first and avoid a heavyweight dependency.
export function parseUA(ua: string): Agent {
  const s = ua || ''
  const browser =
    /Edg\//.test(s) ? 'Edge'
    : /OPR\/|Opera/.test(s) ? 'Opera'
    : /Firefox\//.test(s) ? 'Firefox'
    : /Chrome\//.test(s) ? 'Chrome'
    : /Safari\//.test(s) ? 'Safari'
    : 'Other'
  const os =
    /Windows/.test(s) ? 'Windows'
    : /Android/.test(s) ? 'Android'
    : /(iPhone|iPad|iPod)/.test(s) ? 'iOS'
    : /Mac OS X/.test(s) ? 'macOS'
    : /Linux/.test(s) ? 'Linux'
    : 'Other'
  const device =
    /Mobile|iPhone|iPod|Android.*Mobile/.test(s) ? 'mobile'
    : /iPad|Tablet/.test(s) ? 'tablet'
    : 'desktop'
  return { browser, os, device }
}

export function newId(): string {
  return crypto.randomUUID()
}

// Public API key. The yt_live_ prefix mirrors what the docs and modals show.
export function newApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return 'yt_live_' + hex
}

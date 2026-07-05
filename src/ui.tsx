import type { Child } from 'hono/jsx'
import { style } from './style'

const GITHUB = 'https://github.com/kozmos-tech/yourtraffic'

export const Logo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="13" width="4" height="8" rx="1" fill="#16a34a" />
    <rect x="10" y="8" width="4" height="13" rx="1" fill="#16a34a" />
    <rect x="16" y="3" width="4" height="18" rx="1" fill="#16a34a" />
  </svg>
)

export const Layout = ({ title, desc, children }: { title: string; desc: string; children: Child }) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta name="theme-color" content="#f5f2ea" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://yourtraffic.dev" />
      <meta name="twitter:card" content="summary_large_image" />
      <link
        rel="icon"
        href={'data:image/svg+xml,' +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="4" y="13" width="4" height="8" rx="1" fill="#16a34a"/><rect x="10" y="8" width="4" height="13" rx="1" fill="#16a34a"/><rect x="16" y="3" width="4" height="18" rx="1" fill="#16a34a"/></svg>'
          )}
      />
      <style dangerouslySetInnerHTML={{ __html: style }} />
    </head>
    <body>{children}</body>
  </html>
)

export const Nav = () => (
  <nav class="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="/">
        <Logo />
        yourtraffic
      </a>
      <div class="nav-links">
        <a class="n" href="#" data-open="m-docs">Docs</a>
        <a class="n" href="#" data-open="m-mcp">MCP</a>
        <a class="btn btn-primary btn-sm" href="/app">Start for free</a>
      </div>
    </div>
  </nav>
)

export const Footer = () => (
  <footer>
    <div class="wrap">
      <div class="foot-grid">
        <div class="foot-brand">
          <a class="brand" href="/">
            <Logo />
            yourtraffic
          </a>
          <p>Open-source, privacy-first web analytics. Unlimited projects, a clean API and native MCP support.</p>
        </div>
        <div class="fcol">
          <h4>Developers</h4>
          <a href="#" data-open="m-mcp">MCP server</a>
          <a href="/llms.txt">llms.txt</a>
        </div>
        <div class="fcol">
          <h4>Project</h4>
          <a href={GITHUB}>GitHub</a>
          <a href={GITHUB + '/blob/main/LICENSE'}>License (MIT)</a>
        </div>
      </div>
      <div class="foot-bot">
        <span>Built by <a href="https://kozmos.tech">kozmos.tech</a>. Contact <a href="mailto:meduard.krasniqi@kozmos.tech">meduard.krasniqi@kozmos.tech</a></span>
        <span class="mono">MIT © 2026</span>
      </div>
    </div>
  </footer>
)

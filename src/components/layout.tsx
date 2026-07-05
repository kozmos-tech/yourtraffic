import type { Child } from 'hono/jsx'
import { style } from '../styles/global'
import { SITE_URL } from '../lib/constants'

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
      <meta property="og:url" content={SITE_URL} />
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

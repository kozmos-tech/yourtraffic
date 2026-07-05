import { style } from '../styles/global.js'
import { SITE_URL } from '../lib/constants.js'
import { esc } from '../lib/html.js'

const favicon =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="4" y="13" width="4" height="8" rx="1" fill="#16a34a"/><rect x="10" y="8" width="4" height="13" rx="1" fill="#16a34a"/><rect x="16" y="3" width="4" height="18" rx="1" fill="#16a34a"/></svg>'
  )

export const Layout = ({
  title,
  desc,
  children,
  path = '',
  head = '',
}: {
  title: string
  desc: string
  children: string
  // Absolute path of this page, used for the canonical and og:url tags.
  path?: string
  // Extra tags injected into <head>, such as JSON-LD structured data.
  head?: string
}) => {
  const url = SITE_URL + path
  return `<html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${esc(title)}</title>
      <meta name="description" content="${esc(desc)}" />
      <meta name="theme-color" content="#f5f2ea" />
      <link rel="canonical" href="${esc(url)}" />
      <meta property="og:title" content="${esc(title)}" />
      <meta property="og:description" content="${esc(desc)}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="${esc(url)}" />
      <meta property="og:site_name" content="YourTraffic" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="icon" href="${favicon}" />
      ${head}
      <style>${style}</style>
    </head>
    <body>${children}</body>
  </html>`
}

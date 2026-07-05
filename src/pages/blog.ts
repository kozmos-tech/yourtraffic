import { Layout } from '../components/layout.js'
import { Nav } from '../components/nav.js'
import { Footer } from '../components/footer.js'
import { Modals } from '../components/modals.js'
import { esc } from '../lib/html.js'
import { SITE_URL } from '../lib/constants.js'
import { posts, type Category, type Post } from '../lib/blog.js'

const CATEGORIES: Category[] = ['Alternatives', 'Comparisons', 'Use cases']

// Serialize a value as JSON-LD, neutralizing any "</script>" sequence so the
// data cannot break out of its script tag.
const ld = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const row = (p: Post) => `<a class="post-row" href="/blog/${esc(p.slug)}">
      <span class="post-row-t">${esc(p.title)}</span>
      <span class="post-row-d">${esc(p.desc)}</span>
    </a>`

// The blog index, grouped by category.
export const BlogIndex = () => {
  const groups = CATEGORIES.map((cat) => {
    const items = posts.filter((p) => p.category === cat)
    return `<section class="post-group">
        <h2>${esc(cat)}</h2>
        <div class="post-list">${items.map(row).join('')}</div>
      </section>`
  }).join('')

  const body = `${Nav()}
    <main class="wrap blog-wrap">
      <header class="blog-head">
        <h1>Blog</h1>
        <p>Guides on privacy-first web analytics, honest comparisons and real ways teams use YourTraffic.</p>
      </header>
      ${groups}
    </main>
    ${Footer()}
    ${Modals()}`

  const head = ld({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'YourTraffic Blog',
    url: `${SITE_URL}/blog`,
    description: 'Guides, comparisons and use cases for privacy-first, open-source web analytics.',
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.desc,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  })

  return Layout({
    title: 'Blog. YourTraffic',
    desc: 'Guides, comparisons and use cases for privacy-first, open-source web analytics.',
    children: body,
    path: '/blog',
    head,
  })
}

// A single blog post.
export const BlogPost = (p: Post) => {
  const related = posts
    .filter((r) => r.category === p.category && r.slug !== p.slug)
    .slice(0, 3)

  const relatedBlock = related.length
    ? `<section class="post-related">
        <h2>Related</h2>
        <div class="post-list">${related.map(row).join('')}</div>
      </section>`
    : ''

  const body = `${Nav()}
    <main class="wrap post-wrap">
      <a class="post-back" href="/blog">Blog</a>
      <article class="post">
        <span class="post-cat">${esc(p.category)}</span>
        <h1>${esc(p.title)}</h1>
        ${p.body}
      </article>
      ${relatedBlock}
    </main>
    ${Footer()}
    ${Modals()}`

  const url = `${SITE_URL}/blog/${p.slug}`
  const head = ld({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.desc,
    url,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'YourTraffic', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'YourTraffic', url: SITE_URL },
  })

  return Layout({
    title: `${p.title}. YourTraffic`,
    desc: p.desc,
    children: body,
    path: `/blog/${p.slug}`,
    head,
  })
}

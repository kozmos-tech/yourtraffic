import { Layout } from '../components/layout.js'
import { Nav } from '../components/nav.js'
import { Footer } from '../components/footer.js'
import { Modals } from '../components/modals.js'
import { esc } from '../lib/html.js'
import { posts, type Category, type Post } from '../lib/blog.js'

const CATEGORIES: Category[] = ['Alternatives', 'Comparisons', 'Use cases']

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

  return Layout({
    title: 'Blog. YourTraffic',
    desc: 'Guides, comparisons and use cases for privacy-first, open-source web analytics.',
    children: body,
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

  return Layout({
    title: `${p.title}. YourTraffic`,
    desc: p.desc,
    children: body,
  })
}

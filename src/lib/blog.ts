// Blog content. Each post is a small SEO page rendered at /blog/:slug and
// listed on /blog. Bodies are static HTML, so they are written literally.

export type Category = 'Alternatives' | 'Comparisons' | 'Use cases'

export interface Post {
  slug: string
  title: string
  desc: string
  category: Category
  // Use-case posts are also surfaced in a section on the landing page.
  useCase?: boolean
  body: string
}

const cta = `<div class="post-cta">
    <a class="btn btn-primary" href="/signup">Start for free</a>
    <a class="btn" href="/">See how it works</a>
  </div>`

export const posts: Post[] = [
  {
    slug: 'google-analytics-alternatives',
    title: 'Google Analytics Alternatives',
    desc: 'The best Google Analytics alternatives in 2026, ranked for privacy, simplicity and data ownership.',
    category: 'Alternatives',
    body: `
      <p>Google Analytics 4 is powerful and free, but the cost shows up elsewhere. You pay in cookie banners, sampled data, a steep learning curve and the fact that your visitor data lives on Google servers. If any of that grates, here are the alternatives worth a look.</p>
      <h2>What to look for</h2>
      <p>A good GA replacement should be light on your site, honest about privacy and simple enough to read at a glance. The best options drop cookies entirely, which means no consent banner and full compliance with GDPR, CCPA and PECR out of the box.</p>
      <h2>The short list</h2>
      <ul>
        <li><strong>YourTraffic</strong>. Open-source and cookie-free, with unlimited projects, a REST API and a native MCP server for AI agents. Self-host it for free or run it in the cloud.</li>
        <li><strong>Plausible</strong>. A clean hosted option focused on the essentials.</li>
        <li><strong>Simple Analytics</strong>. Minimal dashboard, privacy-first, hosted only.</li>
        <li><strong>Fathom</strong>. Fast and simple, aimed at small teams.</li>
        <li><strong>Matomo</strong>. Feature-heavy and self-hostable, closer to GA in scope and complexity.</li>
        <li><strong>Umami</strong>. Open-source and self-hosted, developer friendly.</li>
      </ul>
      <h2>Where YourTraffic fits</h2>
      <p>If you want the privacy of Plausible, the openness of Umami and an API that AI agents can actually query, YourTraffic covers all three. There are no per-site limits, so you can track one project or a hundred on the same account. The tracking script is under a kilobyte, so it will not drag your pages down.</p>
      <p>Moving off Google Analytics takes an afternoon. Add your site, drop one script tag in the head and your first visits show up within seconds.</p>
      ${cta}
    `,
  },
  {
    slug: 'plausible-alternatives',
    title: 'Plausible Alternatives',
    desc: 'Looking for a Plausible alternative? Here are the privacy-first analytics tools worth comparing, and where each one wins.',
    category: 'Alternatives',
    body: `
      <p>Plausible helped make privacy-first analytics mainstream, and it is a solid product. Still, people shop around for a reason. Maybe you want to self-host without a monthly bill, maybe you need unlimited sites, or maybe you want an API your tools can talk to. Here are the alternatives worth comparing.</p>
      <h2>Common reasons to switch</h2>
      <ul>
        <li>You want to self-host for free rather than pay per pageview.</li>
        <li>You run many sites and dislike tiered pricing.</li>
        <li>You want deeper API access or agent tooling.</li>
      </ul>
      <h2>The alternatives</h2>
      <ul>
        <li><strong>YourTraffic</strong>. Open-source, cookie-free and MIT licensed, with unlimited projects and a native MCP server. Self-host it or use the cloud.</li>
        <li><strong>Simple Analytics</strong>. A close match in spirit, hosted only.</li>
        <li><strong>Fathom</strong>. Another polished hosted option.</li>
        <li><strong>Umami</strong>. Open-source and self-hosted, no cloud tier from the makers.</li>
        <li><strong>Matomo</strong>. The heavyweight, if you actually need the extra features.</li>
      </ul>
      <h2>Why teams pick YourTraffic</h2>
      <p>YourTraffic keeps everything Plausible users like, a quiet dashboard and no cookies, then removes the ceilings. There are no per-site plans and no pageview caps on self-hosting. Your data sits in your own Postgres database, so nothing leaves your control. The REST API and MCP server mean an AI agent can pull your numbers on demand, which is something most privacy tools still cannot do.</p>
      <p>If Plausible is close but not quite yours, YourTraffic is the open version of the same idea. Add a site, paste one script tag and you are live.</p>
      ${cta}
    `,
  },
  {
    slug: 'simple-analytics-alternatives',
    title: 'Simple Analytics Alternatives',
    desc: 'The best Simple Analytics alternatives for teams that want the same clean dashboard with self-hosting and an open license.',
    category: 'Alternatives',
    body: `
      <p>Simple Analytics nails the pitch. A clean dashboard, no cookies and no creepy tracking. The main limits are that it is hosted only and closed source, so you cannot run it yourself or see how it works. If those matter to you, here are the alternatives.</p>
      <h2>What people miss</h2>
      <p>The most common asks from Simple Analytics users are self-hosting, an open license and pricing that does not climb with traffic. A few tools deliver all three.</p>
      <h2>The alternatives</h2>
      <ul>
        <li><strong>YourTraffic</strong>. The open-source take on the same clean, minimal dashboard. Cookie-free, MIT licensed, unlimited projects, self-host or cloud.</li>
        <li><strong>Plausible</strong>. Similar feel, with a self-hosted community edition.</li>
        <li><strong>Umami</strong>. Developer focused and self-hosted.</li>
        <li><strong>Fathom</strong>. Hosted and simple, much like Simple Analytics itself.</li>
      </ul>
      <h2>Why YourTraffic is the closest match</h2>
      <p>YourTraffic was built for people who like the Simple Analytics look but want to own the stack. You get the same at-a-glance view of visitors, pageviews and top pages, without cookies or consent banners. Because it is open source, you can read every line, self-host it for free and keep your visitor data in your own database.</p>
      <p>On top of that you get a REST API and a native MCP server, so your dashboards and even your AI agents can read stats directly. Add a site, drop in one script tag and your numbers appear within seconds.</p>
      ${cta}
    `,
  },
  {
    slug: 'fathom-analytics-alternatives',
    title: 'Fathom Analytics Alternatives',
    desc: 'The best Fathom Analytics alternatives for privacy-first teams, including open-source and self-hosted options.',
    category: 'Alternatives',
    body: `
      <p>Fathom is a tidy, privacy-first analytics tool with a loyal following. It is hosted only and closed source though, so if you want to self-host, read the code or avoid a recurring bill, it is worth seeing what else is out there.</p>
      <h2>Reasons to compare</h2>
      <ul>
        <li>You prefer open source over a closed platform.</li>
        <li>You want to self-host and keep data in your own database.</li>
        <li>You run several sites and want one flat account.</li>
      </ul>
      <h2>The alternatives</h2>
      <ul>
        <li><strong>YourTraffic</strong>. Open-source and cookie-free, with unlimited projects, a REST API and a native MCP server. Free to self-host, or hosted for you.</li>
        <li><strong>Plausible</strong>. Comparable hosted product with a community edition.</li>
        <li><strong>Simple Analytics</strong>. Minimal and hosted, similar audience.</li>
        <li><strong>Umami</strong>. Self-hosted and open, popular with developers.</li>
      </ul>
      <h2>Why YourTraffic stands out</h2>
      <p>YourTraffic gives you everything Fathom users value, fast tracking, no cookies and a simple dashboard, plus the freedom that comes with an open license. You can host it yourself for free, keep visitor data in your own Postgres and never hit a per-site limit.</p>
      <p>The API and MCP server also make it a better fit for automation. An agent or an internal tool can pull your stats directly, no manual export needed. Setup is a single script tag, and stats land within seconds of the first visit.</p>
      ${cta}
    `,
  },
  {
    slug: 'matomo-alternatives',
    title: 'Matomo Alternatives',
    desc: 'The best Matomo alternatives for teams that want privacy-first analytics without the weight and setup.',
    category: 'Alternatives',
    body: `
      <p>Matomo is the veteran of open-source analytics. It does a lot, which is exactly the problem for many teams. The self-hosted setup is heavy, the interface is dense and most people use a fraction of the features. If you want privacy-first analytics that are lighter to run and easier to read, here are the alternatives.</p>
      <h2>Where Matomo gets heavy</h2>
      <p>Matomo can need a tuned database, background jobs and ongoing maintenance to stay fast on a busy site. The dashboard mirrors that depth. For a lot of sites, it is more tool than the job requires.</p>
      <h2>Lighter alternatives</h2>
      <ul>
        <li><strong>YourTraffic</strong>. Open-source and cookie-free, backed by a single Postgres database. Unlimited projects, a REST API and a native MCP server. Deploys in minutes.</li>
        <li><strong>Umami</strong>. Self-hosted and lightweight.</li>
        <li><strong>Plausible</strong>. Simple and hosted, with a community edition.</li>
        <li><strong>Simple Analytics</strong>. Minimal and hosted.</li>
      </ul>
      <h2>Why YourTraffic is the easy swap</h2>
      <p>YourTraffic keeps what people like about Matomo, open source and full data ownership, and drops the overhead. There is one script tag, one database and a dashboard you can understand at a glance. No cookies means no consent banner and clean compliance with GDPR, CCPA and PECR.</p>
      <p>You can self-host it for free under the MIT license or run it in the cloud. Either way you get unlimited sites and an API that both your own tools and AI agents can query.</p>
      ${cta}
    `,
  },
  {
    slug: 'umami-alternatives',
    title: 'Umami Alternatives',
    desc: 'The best Umami alternatives for developers who want open-source, privacy-first analytics with more built in.',
    category: 'Alternatives',
    body: `
      <p>Umami is a favorite among developers for good reason. It is open source, self-hosted and privacy-first. If you want the same values with a hosted option, a first-class API or native agent support, it is worth seeing the alternatives.</p>
      <h2>What developers ask for next</h2>
      <ul>
        <li>A managed cloud tier so you do not have to run it yourself.</li>
        <li>A documented REST API for dashboards and automation.</li>
        <li>Tooling that AI agents can call directly.</li>
      </ul>
      <h2>The alternatives</h2>
      <ul>
        <li><strong>YourTraffic</strong>. Open-source and cookie-free like Umami, plus a hosted option, a REST API and a native MCP server. Unlimited projects.</li>
        <li><strong>Plausible</strong>. Hosted and simple, community edition available.</li>
        <li><strong>Matomo</strong>. Feature-rich but heavier to run.</li>
        <li><strong>Simple Analytics</strong>. Minimal and hosted.</li>
      </ul>
      <h2>Why YourTraffic is the natural upgrade</h2>
      <p>YourTraffic keeps the parts developers like about Umami, an open license, self-hosting and a Postgres backend, then adds the pieces you usually have to build yourself. The REST API is documented and ready, so pulling stats into a dashboard or a script is a Bearer token away.</p>
      <p>The native MCP server is the real differentiator. Point an AI agent at your instance and it can read your traffic on demand through OAuth, no API key juggling required. Run it yourself for free or let the cloud handle it.</p>
      ${cta}
    `,
  },
  {
    slug: 'yourtraffic-vs-google-analytics-4',
    title: 'YourTraffic vs Google Analytics 4',
    desc: 'A straight comparison of YourTraffic and Google Analytics 4 on privacy, data ownership, simplicity and pricing.',
    category: 'Comparisons',
    body: `
      <p>Google Analytics 4 is the default choice, and YourTraffic is the privacy-first alternative. Here is how they actually differ so you can decide which fits your site.</p>
      <h2>Privacy and cookies</h2>
      <p>GA4 uses cookies and collects personal data, which is why it needs a consent banner and a fair amount of legal care in the EU. YourTraffic sets no cookies and stores no personal data, so there is no banner and compliance with GDPR, CCPA and PECR comes by default.</p>
      <h2>Data ownership</h2>
      <p>With GA4 your visitor data lives on Google infrastructure and feeds their ecosystem. With YourTraffic the data sits in your own Postgres database when you self-host, so it never leaves your control.</p>
      <h2>Simplicity</h2>
      <p>GA4 is broad and takes real time to learn. Reports are sampled and the interface is dense. YourTraffic shows visitors, pageviews, top pages, sources and countries at a glance, with no setup beyond one script tag.</p>
      <h2>Developers and agents</h2>
      <p>YourTraffic ships a documented REST API and a native MCP server, so both your tools and AI agents can read stats directly. GA4 has an API too, but it carries the same complexity as the rest of the platform.</p>
      <h2>Pricing</h2>
      <p>GA4 is free but paid for with your data and your time. YourTraffic is free to self-host under the MIT license, with a paid cloud option if you would rather not run it. There are no per-site limits either way.</p>
      <p>If you want numbers you can trust without the banner, the sampling or the learning curve, YourTraffic is the simpler trade. Add a site, drop one script tag and you are live in minutes.</p>
      ${cta}
    `,
  },
  {
    slug: 'yourtraffic-vs-plausible',
    title: 'YourTraffic vs Plausible',
    desc: 'A clear comparison of YourTraffic and Plausible on openness, pricing, limits and agent support.',
    category: 'Comparisons',
    body: `
      <p>YourTraffic and Plausible sit close together. Both are privacy-first, both are cookie-free and both keep the dashboard clean. The differences are in openness, limits and tooling.</p>
      <h2>Open source</h2>
      <p>Plausible offers a hosted product and a separate community edition. YourTraffic is fully open under the MIT license, the same product whether you self-host or use the cloud. No feature is held back for a paid tier.</p>
      <h2>Limits and pricing</h2>
      <p>Plausible prices by monthly pageviews. YourTraffic has no per-site limits and no pageview caps when you self-host, so tracking one site or a hundred costs the same. The cloud option is there if you would rather not run it.</p>
      <h2>Data ownership</h2>
      <p>Self-hosted YourTraffic keeps every event in your own Postgres database. Nothing is sent to a third party, and you can query the raw data whenever you want.</p>
      <h2>API and agents</h2>
      <p>Both tools have an API. YourTraffic goes further with a native MCP server, so an AI agent can sign in through OAuth and read your traffic directly. That makes it a stronger fit if automation or agent tooling is part of your workflow.</p>
      <h2>The bottom line</h2>
      <p>If you like Plausible but want the open version with no ceilings and agent support built in, YourTraffic is the closer match. Add a site, paste one script tag and stats appear within seconds.</p>
      ${cta}
    `,
  },
  {
    slug: 'yourtraffic-vs-simple-analytics',
    title: 'YourTraffic vs Simple Analytics',
    desc: 'A side-by-side look at YourTraffic and Simple Analytics on openness, self-hosting, pricing and the API.',
    category: 'Comparisons',
    body: `
      <p>YourTraffic and Simple Analytics share a look and a philosophy. A minimal dashboard, no cookies and no invasive tracking. The split comes down to whether you can own and extend the tool.</p>
      <h2>Open source and self-hosting</h2>
      <p>Simple Analytics is hosted and closed source, so you use it as a service. YourTraffic is open under the MIT license, so you can read the code, self-host it for free and keep your visitor data in your own Postgres database.</p>
      <h2>Pricing and limits</h2>
      <p>Simple Analytics prices by pageviews on a hosted plan. YourTraffic has no per-site limits and is free when self-hosted, with a cloud option if you prefer. You can run unlimited projects on one account.</p>
      <h2>Dashboard</h2>
      <p>Both keep it clean and readable. YourTraffic shows visitors, pageviews, top pages, sources and countries without clutter, the same at-a-glance feel Simple Analytics users expect.</p>
      <h2>API and agents</h2>
      <p>YourTraffic ships a documented REST API and a native MCP server. Your own tools can pull stats with a Bearer token, and an AI agent can read your traffic directly through OAuth. That opens up automation that a closed hosted tool cannot.</p>
      <h2>The bottom line</h2>
      <p>If you like the Simple Analytics style but want to own the stack and build on top of it, YourTraffic is the open equivalent. Add a site, drop one script tag and you are live.</p>
      ${cta}
    `,
  },
  {
    slug: 'web-analytics-for-agencies',
    title: 'Web Analytics for Agencies Managing Many Client Sites',
    desc: 'How agencies track dozens of client sites from one dashboard, without cookie banners or per-site pricing.',
    category: 'Use cases',
    useCase: true,
    body: `
      <p>Agencies have a specific problem with analytics. Every client is a separate site, most tools charge per site or per pageview, and each new project brings another conversation about cookie banners. YourTraffic is built for this way of working.</p>
      <h2>One account, every client</h2>
      <p>You add each client site as its own project under a single account. There are no per-site plans and no pageview caps when you self-host, so your tenth client costs the same as your first. Each project gets its own dashboard with visitors, pageviews, top pages, sources and countries.</p>
      <h2>Setting it up</h2>
      <p>Create a project, copy the one line script tag and add it to the client site, usually in the theme header or through a tag manager. Visits start showing within seconds. If you manage sites in bulk, you can create projects and read stats through the REST API instead of clicking through the dashboard.</p>
      <h2>What clients see</h2>
      <p>When a client asks how last month went, you open their dashboard and the answer is right there. No training and no GA4 tour. Because there are no cookies and no personal data, none of your clients need a consent banner, so compliance with GDPR, CCPA and PECR is the default.</p>
      <h2>Into your own reports</h2>
      <p>Each project has an API key. Pass it as a Bearer token to the stats endpoint and you can pull a client's numbers straight into your monthly report or a shared dashboard, with no manual exports.</p>
      <p>Self-host it for free under the MIT license or run it in the cloud. Adding a client is one script tag away.</p>
      ${cta}
    `,
  },
  {
    slug: 'analytics-for-indie-hackers',
    title: 'Analytics for Indie Hackers Running Many Side Projects',
    desc: 'Track every side project from one dashboard with no per-site fees, no cookies and a clean at-a-glance view.',
    category: 'Use cases',
    useCase: true,
    body: `
      <p>If you ship often, you probably have a pile of side projects at different stages of life. Tracking them all on a per-site analytics plan adds up fast, and a heavy tool is overkill for a landing page. YourTraffic fits the way indie hackers actually work.</p>
      <h2>Every project in one place</h2>
      <p>Add all your domains to one account. There are no per-site limits, so your fifth project costs the same as your first. The project list shows a card per site with its recent visitors, so you can see at a glance which ones have a pulse.</p>
      <h2>Setting it up</h2>
      <p>Add a project, drop the one line script tag into your page head and you are done. The script is under a kilobyte, so it will not slow down a page you are trying to keep fast, and there is no cookie banner cluttering a launch you are testing.</p>
      <h2>What you get</h2>
      <p>Visitors, pageviews, top pages and referrers, without sampling. When a Show HN or a Product Hunt post lands, you can watch the traffic arrive close to real time and see which posts are actually sending people.</p>
      <h2>For builders</h2>
      <p>Every project has a REST API key, so you can put a live visitor count on your own site or in a personal dashboard. There is an MCP server too, so you can ask an AI agent how a project is doing and get a real answer from live data.</p>
      <p>Self-host it for free or use the cloud. Add a project, paste one script tag and you are tracking within seconds.</p>
      ${cta}
    `,
  },
  {
    slug: 'analytics-for-ai-agents',
    title: 'Analytics for AI Agents That Read Your Traffic',
    desc: 'Give an AI agent secure, read access to your web analytics through a native MCP server, no API keys to paste.',
    category: 'Use cases',
    useCase: true,
    body: `
      <p>AI agents are getting good at real work, but they can only act on data they can reach, and most analytics tools were never built for an agent to query. YourTraffic ships a native MCP server, so an agent can read your traffic directly.</p>
      <h2>What the MCP server does</h2>
      <p>MCP is the standard way to give an AI agent tools and data. Point an agent at your YourTraffic instance and it can pull visitor counts, top pages, sources and trends on demand, instead of you copying numbers into a prompt.</p>
      <h2>Setting it up</h2>
      <p>Add the MCP server to your agent client, for example Claude, and sign in once through OAuth to approve access. No API key is pasted into a config file. The agent gets read access to your stats and nothing else, and you can revoke it whenever you want.</p>
      <h2>What it looks like in use</h2>
      <p>You ask which pages gained traffic this week, or whether yesterday's launch moved anything, and the agent answers from live data. Paired with your other tools it can go further, drafting a traffic summary or flagging a sudden drop without you opening a dashboard.</p>
      <h2>A plain REST API too</h2>
      <p>If you would rather build directly, the same data is available over a documented REST API with a Bearer token. The MCP server is the agent-friendly layer on top of it.</p>
      <p>Self-host YourTraffic for free or use the cloud. Add a site, drop one script tag and your traffic is ready for you and your agents.</p>
      ${cta}
    `,
  },
  {
    slug: 'cookie-free-analytics-no-consent-banner',
    title: 'Cookie-Free Analytics for Sites Without a Consent Banner',
    desc: 'Drop the cookie banner for good with analytics that set no cookies and store no personal data.',
    category: 'Use cases',
    useCase: true,
    body: `
      <p>Consent banners get in the way of every first visit. They exist mostly because your analytics tool sets cookies and collects personal data. Remove that tool and the banner can go with it. That is the idea behind YourTraffic.</p>
      <h2>Why the banner is there</h2>
      <p>Under GDPR and PECR you need consent before setting non-essential cookies or processing personal data. Google Analytics and tools like it do both, which is what triggers the banner. It is the tracking method that creates the requirement, not the law being awkward.</p>
      <h2>How cookie-free tracking works</h2>
      <p>YourTraffic counts visits without cookies and without storing personal data. Visitors are counted with a rotating, salted hash that cannot be traced back to a person. You still get accurate visitors, pageviews, sources and countries, just without the identifiers that need consent.</p>
      <h2>Setting it up</h2>
      <p>Add your site, copy the one line script tag into your page head and remove the cookie banner that was only there for analytics. That is the whole change. Visits show up within seconds and the script stays under a kilobyte.</p>
      <h2>What you keep</h2>
      <p>For most sites the numbers that drive decisions are traffic trends, top content and where visitors come from. You get all of that at a glance, with a REST API and MCP server if you want to go deeper. Compliance with GDPR, CCPA and PECR comes by default.</p>
      <p>Self-host it for free or run it in the cloud. One script tag in, one banner out.</p>
      ${cta}
    `,
  },
  {
    slug: 'analytics-with-data-in-your-own-database',
    title: 'Analytics With Data in Your Own Database',
    desc: 'Keep every analytics event in your own Postgres for data residency, control and clean audits.',
    category: 'Use cases',
    useCase: true,
    body: `
      <p>For a lot of companies the question is not only which analytics tool, but where the data ends up. If your legal or security team cares about data residency, sending visitor data to a third party is a hard sell. YourTraffic keeps it in a database you own.</p>
      <h2>Your Postgres, your data</h2>
      <p>When you self-host, every event lands in a Postgres database you control and never leaves your infrastructure. You pick the region, the backups and who has access, which makes data residency and retention rules straightforward to meet.</p>
      <h2>Setting it up</h2>
      <p>Point YourTraffic at your Postgres connection string, run the migration and deploy. It is one app and one database, with no separate pipeline to maintain. Add a site, drop the script tag and events start flowing into your own tables.</p>
      <h2>What you can do with it</h2>
      <p>Because the data sits in your Postgres, you are not boxed in by a vendor dashboard. Run SQL against it, join it with other tables or pipe it into your warehouse. The documented REST API and MCP server are there when you want the ready made views instead.</p>
      <h2>Easier to review</h2>
      <p>The code is open under the MIT license and the data is yours, so there is nothing hidden to audit. Your security team can read exactly what is collected, which is no cookies and no personal data, and confirm where it is stored.</p>
      <p>Keep your visitor data where your policies require it. One script tag in, everything in a database you own.</p>
      ${cta}
    `,
  },
  {
    slug: 'analytics-with-a-rest-api',
    title: 'Web Analytics With a REST API',
    desc: 'Pull your visitor stats straight into dashboards, reports and scripts with a documented REST API.',
    category: 'Use cases',
    useCase: true,
    body: `
      <p>Plenty of analytics tools keep your numbers locked behind their dashboard. If you want to put a live counter on your site, feed a report or build on top of your data, you need a real API. YourTraffic gives you one.</p>
      <h2>One key, one endpoint</h2>
      <p>Every project has an API key, shown under Settings in the dashboard. Pass it as a Bearer token to the stats endpoint and you get visitors, pageviews, top pages, sources and countries back as clean JSON. No scraping and no export files.</p>
      <h2>Getting started</h2>
      <p>Copy your project key, send a request to the stats endpoint with the range you want and read the response. Wiring it into a script or a cron job takes minutes, and there is a full guide at llms.txt written to be read by both people and machines.</p>
      <h2>What you can build</h2>
      <ul>
        <li>A live visitor counter or a public stats page on your own site.</li>
        <li>Weekly reports pulled straight from the source.</li>
        <li>Internal dashboards that combine traffic with your other metrics.</li>
        <li>Alerts that fire when traffic spikes or drops.</li>
      </ul>
      <h2>Agents too</h2>
      <p>If your workflow involves AI agents, the native MCP server sits on top of the same data. An agent signs in through OAuth and reads your traffic directly, with no API key to paste anywhere.</p>
      <p>Self-host YourTraffic for free or use the cloud. Add a site, grab your key and start pulling stats within minutes.</p>
      ${cta}
    `,
  },
]

export const getPost = (slug: string) => posts.find((p) => p.slug === slug)

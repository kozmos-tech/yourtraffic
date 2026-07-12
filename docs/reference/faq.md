# FAQ

## Do I need a cookie consent banner?

No. YourTraffic sets no cookies and stores no personal data, so there is nothing to consent to. See [Privacy and Compliance](privacy.md).

## How many websites can I track?

As many as you want. There are no per-site limits and no pageview caps when you self-host. One project or a hundred costs the same.

## How big is the tracking script?

Under 1 KB. It is a few hundred bytes, loads with `defer` and will not drag your pages down.

## How long until stats show up?

Within seconds of the first real visit. Events from `localhost`, `127.0.0.1` and `file://` pages are ignored, so local testing does not pollute your stats.

## Does it work with single-page apps?

Yes. The script follows client-side navigation on its own and records a pageview for each route change. See [Tracking Script](../guides/tracking-script.md).

## Can I track custom events?

Yes. Call `window.yt('EventName')` from your own click or submit handler. Events are counted by name and read back with the `by=event` breakdown on the [stats endpoint](../integrations/rest-api.md).

## Can I read my stats programmatically?

Yes, over the [REST API](../integrations/rest-api.md) with a Bearer token, or through the native [MCP Server](../integrations/mcp-server.md) for AI agents.

## Where is my data stored?

When you self-host, in your own Postgres database. It never leaves your infrastructure. See [Self-Hosting](../guides/self-hosting.md).

## Is it really free?

Self-hosting is free under the MIT license. There is a paid cloud option if you would rather not run it yourself. It is the same product either way, with no features held back for a paid tier.

## Can I move off Google Analytics without losing much?

For most sites the numbers that drive decisions are traffic trends, top content and where visitors come from. You get all of that at a glance. Moving over takes an afternoon: add your site and drop in one script tag.

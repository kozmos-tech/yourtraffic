# Getting Started

You can be tracking a website in under a minute. There is no configuration and nothing to install on your machine.

## 1. Create an account

Sign in at [yourtraffic.dev](https://yourtraffic.dev) or your own self-hosted instance. If you are running YourTraffic yourself, see [Self-Hosting](self-hosting.md) first.

## 2. Add a website

From the dashboard, add a project by entering its domain, like `example.com`. Give it a name if you want one, otherwise the domain is used. There are no per-site limits, so add as many projects as you like on one account.

## 3. Install the tracking script

Copy the snippet shown after you create the project and paste it into the `<head>` of every page you want to track.

```html
<script defer src="https://yourtraffic.dev/script.js"></script>
```

That is the whole setup. The script is a few hundred bytes, sets no cookies, reads no storage and needs no config. See [Tracking Script](tracking-script.md) for details on single-page apps and custom events.

## 4. Watch your stats

Stats appear within seconds of the first real visit. Each project has its own dashboard showing:

- Visitors (unique per day) and pageviews.
- A live count of visitors active in the last five minutes.
- Time on page.
- Breakdowns by page, referrer, country, browser and device.

Events from `localhost`, `127.0.0.1` and `file://` pages are ignored, so local development does not pollute your stats.

## Next steps

- Read your stats programmatically with the [REST API](../integrations/rest-api.md).
- Let an AI agent query your traffic with the [MCP Server](../integrations/mcp-server.md).

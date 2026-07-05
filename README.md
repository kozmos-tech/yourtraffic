# YourTraffic

Open-source, privacy-first web analytics. Unlimited websites, a first-class REST API and a native MCP server for agents. No cookies, no personal data, no consent banners.

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed globally
- A Postgres database

## Develop locally

```
npm install
vc dev
```

```
open http://localhost:3000
```

## Build locally

```
npm install
vc build
```

## Deploy

```
npm install
vc deploy
```

## Database

Schema lives in [src/db/schema.ts](src/db/schema.ts). Generate a migration after changing it, then apply it.

```
npm run db:generate
npm run db:migrate
```

## Reading your stats

Every project has an api key, shown under Settings in the dashboard.

- REST API. Pass the key as a Bearer token to `/api/v1/stats`. See [llms.txt](https://yourtraffic.dev/llms.txt) for the full guide.
- MCP server. Point an agent at `/mcp`. It uses OAuth, so you sign in to approve access and no api key is needed.

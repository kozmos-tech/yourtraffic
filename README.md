# YourTraffic

Open-source, privacy-first web analytics. Unlimited websites, a first-class REST API and a native MCP server for agents. No cookies, no personal data, no consent banners.

## Self-hosting

### Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed globally
- A Postgres database
- Node 20 or newer

### Set up

Clone the repo and install dependencies.

```
git clone https://github.com/kozmos-tech/yourtraffic
cd yourtraffic
npm install
```

Copy the example env file and fill it in.

```
cp .env.example .env
```

- `DATABASE_URL`. Your Postgres connection string. The app fails to start without it.
- `BETTER_AUTH_SECRET`. A long random secret. Generate one with `openssl rand -base64 32`. Never ship the default, since visitor hashes are salted from it.
- `BETTER_AUTH_URL`. The public origin of your deployment, like `https://analytics.example.com`. Use `http://localhost:3000` in development. This is also the origin MCP clients discover for OAuth, so it must be the exact public URL with no trailing path.

Create the database tables before the first run.

```
npm run db:migrate
```

### Run it

```
vc dev
open http://localhost:3000
```

Sign in, add a website, then drop the shown snippet into the `<head>` of your site. Stats appear within seconds of the first visit.

## Deploy

```
npm install
vc deploy
```

Set `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in your Vercel project settings, then run the migration against your production database.

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

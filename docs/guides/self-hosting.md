# Self-Hosting

YourTraffic is MIT licensed and free to self-host. It is one app and one Postgres database, with no separate pipeline to maintain.

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed globally.
- A Postgres database.
- Node 20 or newer.

## Set up

Clone the repo and install dependencies.

```bash
git clone https://github.com/kozmos-tech/yourtraffic
cd yourtraffic
npm install
```

Copy the example env file and fill it in.

```bash
cp .env.example .env
```

- `DATABASE_URL`. Your Postgres connection string. The app fails to start without it.
- `BETTER_AUTH_SECRET`. A long random secret. Generate one with `openssl rand -base64 32`. Never ship the default, since visitor hashes are salted from it.
- `BETTER_AUTH_URL`. The public origin of your deployment, like `https://analytics.example.com`. Use `http://localhost:3000` in development. This is also the origin MCP clients discover for OAuth, so it must be the exact public URL with no trailing path.

Create the database tables before the first run.

```bash
npm run db:migrate
```

## Run it locally

```bash
vc dev
open http://localhost:3000
```

Sign in, add a website, then drop the shown snippet into the `<head>` of your site. Stats appear within seconds of the first visit.

## Deploy

```bash
npm install
vc deploy
```

Set `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in your Vercel project settings, then run the migration against your production database.

## Database

The schema lives in `src/db/schema.ts`. Generate a migration after changing it, then apply it.

```bash
npm run db:generate
npm run db:migrate
```

Because the data sits in your own Postgres, you are not boxed in by a vendor dashboard. Run SQL against it, join it with other tables or pipe it into your warehouse. See [Privacy and Compliance](../reference/privacy.md) for what is stored.

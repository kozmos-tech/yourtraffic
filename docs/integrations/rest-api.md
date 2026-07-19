# REST API

Read your stats over a simple HTTP API and get clean JSON back. No scraping and no export files.

Every project has its own API key, shown under Settings in the dashboard. Pass it as a Bearer token to read that project's stats.

## Authentication

Send your project API key in the `Authorization` header.

```
Authorization: Bearer yt_live_...
```

Each key is scoped to a single project. A missing key returns `401` with `{ "error": "Missing api key." }`; an unknown key returns `401` with `{ "error": "Invalid api key." }`.

## Stats endpoint

```
GET /api/v1/stats
```

Returns visitors, pageviews and optional breakdowns for the authorized project.

### Query parameters

| Parameter | Values | Default | Description |
| --- | --- | --- | --- |
| `period` | `24h`, `7d`, `30d`, `12mo` | `7d` | The time range. |
| `group` | `hour`, `day`, `week`, `month` | Chosen from the period | Bucket size for the time series. |
| `by` | `page`, `referrer`, `country`, `browser`, `os`, `device`, `event`, or a comma list | none | One or more breakdown dimensions. |

### Response shape

A JSON object with these fields.

- `site`. The project domain.
- `period`. The period you asked for.
- `totals`. An object with `visitors` and `pageviews` counts.
- `series`. An array of buckets, each with `date`, `visitors` and `pageviews`.
- `breakdown`. Present when you pass a single `by` value. An array of rows, each with `name`, `visitors` and `pageviews`, ordered by pageviews.

### Example

```bash
curl "https://yourtraffic.dev/api/v1/stats?period=30d&by=page" \
  -H "Authorization: Bearer yt_live_..."
```

## Health check

```
GET /api/health
```

No auth. Returns service status.

```json
{ "status": "ok", "service": "yourtraffic", "version": "0.1.0" }
```

## What you can build

- A live visitor counter or a public stats page on your own site.
- Weekly reports pulled straight from the source.
- Internal dashboards that combine traffic with your other metrics.
- Alerts that fire when traffic spikes or drops.

## Agents

If your workflow involves AI agents, the native [MCP Server](mcp-server.md) sits on top of the same data, so an agent can read your traffic through OAuth with no API key to paste anywhere.

A compact, machine-readable version of this guide lives at [llms.txt](https://yourtraffic.dev/llms.txt).

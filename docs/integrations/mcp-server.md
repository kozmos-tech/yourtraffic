
# MCP Server

YourTraffic ships a native MCP (Model Context Protocol) server, so an AI agent can read your traffic directly. Point an agent at your instance and it can pull visitor counts, top pages, sources and trends on demand.

The server is hosted and remote. Auth is OAuth, not an API key, so you sign in to approve access and no key is pasted into a config file. The agent gets read access to the websites on your account and nothing else, and you can revoke it whenever you want.

## Endpoint

```
https://yourtraffic.dev/mcp
```

On a self-hosted instance, use your own origin.

## Connect with npx

The easiest way to connect a stdio MCP client is the launcher package, which bridges a stdio client to the hosted endpoint. Add YourTraffic to your MCP client config:

```json
{
  "mcpServers": {
    "yourtraffic": {
      "command": "npx",
      "args": ["-y", "@kozmos-tech/yourtraffic"]
    }
  }
}
```

On first run the bridge opens a browser to sign in through OAuth. After that your session is cached and the client sees YourTraffic's tools.

## Connect a remote MCP client directly

Clients that speak remote MCP can point straight at the endpoint. The endpoint advertises its authorization server, so the client registers itself and opens a browser for you to sign in. Once you approve, the agent can only see the websites on your account.

## Tools

- `list_websites`. Lists the websites on your account, each with its name and domain.
- `get_stats`. Returns stats for one website. Takes `site` (the domain), an optional `period` (`24h`, `7d`, `30d`, `12mo`) and an optional `by` breakdown (`page`, `referrer`, `country`, `browser`, `device`, `event`, or `prop:KEY` to break custom events down by a custom property value).

## Authentication options

- **OAuth (default).** The first run opens a browser to authorize the connection.
- **API key.** For scripts and headless setups, mint a scoped key in the dashboard and pass it as a Bearer token via your client's header settings.

## Self-hosting the bridge

Point the launcher at your own instance with an environment variable.

```json
{
  "mcpServers": {
    "yourtraffic": {
      "command": "npx",
      "args": ["-y", "@kozmos-tech/yourtraffic"],
      "env": { "YOURTRAFFIC_MCP_URL": "https://analytics.example.com/mcp" }
    }
  }
}
```

`YOURTRAFFIC_MCP_URL` defaults to `https://yourtraffic.dev/mcp`.

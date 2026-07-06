# @kozmos-tech/yourtraffic

MCP bridge for [YourTraffic](https://yourtraffic.dev) — privacy-first web analytics your AI tools can query.

YourTraffic's MCP server is hosted and remote. This package is a tiny launcher that
bridges any stdio MCP client to the hosted endpoint, so clients that only speak
stdio (or launch servers via `npx`) can connect with one config block.

## Usage

Add YourTraffic to your MCP client config:

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

That's it. On first run the bridge opens a browser to sign in (OAuth); after that
your session is cached. The client then sees YourTraffic's analytics tools — list
your websites and query stats such as pageviews, visitors, referrers and paths.

## Authentication

- **OAuth (default):** the first run opens a browser to authorize the connection.
- **API key:** for scripts and headless setups, mint a scoped key in the YourTraffic
  dashboard and pass it as a bearer token via your client's header settings.

## Self-hosting

Point the bridge at your own YourTraffic instance with an environment variable:

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

## License

MIT

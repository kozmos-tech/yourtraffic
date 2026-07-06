#!/usr/bin/env node
// Thin stdio -> remote bridge for the YourTraffic MCP server.
//
// YourTraffic's MCP server is remote (Streamable HTTP at https://yourtraffic.dev/mcp,
// OAuth + API-key auth). This launcher execs the mcp-remote CLI against that
// endpoint so any stdio-only client can connect via `npx @kozmos-tech/yourtraffic`.
// Self-hosters can point at their own instance with YOURTRAFFIC_MCP_URL.
import { spawn } from "node:child_process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const url = process.env.YOURTRAFFIC_MCP_URL ?? "https://yourtraffic.dev/mcp"

// Resolve mcp-remote's CLI entry from its own package.json "bin" so we don't
// hardcode a dist path that could move between releases.
const pkg = require("mcp-remote/package.json")
const binRel = typeof pkg.bin === "string" ? pkg.bin : pkg.bin["mcp-remote"]
const cli = require.resolve(`mcp-remote/${binRel}`)

const child = spawn(process.execPath, [cli, url, ...process.argv.slice(2)], { stdio: "inherit" })
child.on("exit", (code) => process.exit(code ?? 0))

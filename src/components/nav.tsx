import { Logo } from './logo'

export const Nav = () => (
  <nav class="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="/">
        <Logo />
        YourTraffic
      </a>
      <div class="nav-links">
        <a class="n" href="#" data-open="m-docs">Docs</a>
        <a class="n" href="#" data-open="m-mcp">MCP</a>
        <a class="btn btn-primary btn-sm" href="/app">Start for free</a>
      </div>
    </div>
  </nav>
)

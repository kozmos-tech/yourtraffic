import { Logo } from './logo.js'

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
        <a class="n" href="/llms.txt">llms.txt</a>
        <a class="n" href="/login">Sign in</a>
        <a class="btn btn-primary btn-sm" href="/signup">Get started</a>
      </div>
    </div>
  </nav>
)

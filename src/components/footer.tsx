import { Logo } from './logo'
import { GITHUB } from '../lib/constants'

export const Footer = () => (
  <footer>
    <div class="wrap">
      <div class="foot-grid">
        <div class="foot-brand">
          <a class="brand" href="/">
            <Logo />
            YourTraffic
          </a>
          <p>Open-source, privacy-first web analytics. Unlimited projects, a clean API and native MCP support.</p>
        </div>
        <div class="fcol">
          <h4>Developers</h4>
          <a href="#" data-open="m-mcp">MCP server</a>
          <a href="/llms.txt">llms.txt</a>
        </div>
        <div class="fcol">
          <h4>Project</h4>
          <a href={GITHUB}>GitHub</a>
          <a href={GITHUB + '/blob/main/LICENSE'}>License (MIT)</a>
        </div>
      </div>
      <div class="foot-bot">
        <span>Built by <a href="https://kozmos.tech">kozmos.tech</a>. Contact <a href="mailto:meduard.krasniqi@kozmos.tech">meduard.krasniqi@kozmos.tech</a></span>
        <span class="mono">MIT © 2026</span>
      </div>
    </div>
  </footer>
)

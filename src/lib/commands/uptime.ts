import { register } from "@/lib/shell/registry";
import { t, c, cy, fg, mu, L } from "./_helpers";

const SESSION_START = Date.now();

register({
  name: "uptime",
  description: "Show how long PortfolioOS has been running.",
  run: () => {
    const ms = Date.now() - SESSION_START;
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const h = Math.floor(ms / 3600000);
    const up = `${h}h ${m}m ${s}s`;
    const load = (1 + Math.random() * 0.4).toFixed(2);
    return [
      t.rich([
        L(c("up"), fg(" " + up + "  "), mu("1 user  "), cy("load average:"), fg(` ${load}, ${load}, ${load}`)),
        L(mu("// PortfolioOS keeps ticking while you explore")),
      ]),
    ];
  },
});

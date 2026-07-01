import { register } from "@/lib/shell/registry";
import { t, c, cy, mu, fg, L, pad } from "./_helpers";
import { socials } from "@/lib/data/portfolio";

register({
  name: "socials",
  description: "List social links.",
  run: ({ compact }) => {
    const lines: any[] = [L(c("Socials")), L("")];
    const w = 14;
    for (const s of socials) {
      if (compact) {
        // Mobile: label + handle on one line, URL wraps below
        lines.push(L(cy(s.label + ":"), fg(" " + s.handle)));
        lines.push(L(mu("  → " + s.url)));
      } else {
        lines.push(L(pad(cy(s.label), w), fg(` ${s.handle}`), mu(`  → ${s.url}`)));
      }
    }
    return [t.rich(lines)];
  },
});

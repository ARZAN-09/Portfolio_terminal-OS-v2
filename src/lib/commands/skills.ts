import { register } from "@/lib/shell/registry";
import { t, c, cy, mu, fg, L, pad, padC } from "./_helpers";
import { skills } from "@/lib/data/portfolio";

register({
  name: "skills",
  description: "List skills grouped by category.",
  aliases: ["skill"],
  run: ({ compact }) => {
    const lines: any[] = [];
    lines.push(L(c("Skills"), mu(" (grouped by category)")));
    lines.push("");
    const entries = Object.entries(skills);
    const maxCat = Math.max(...entries.map(([cat]) => cat.length), 10);
    for (const [cat, list] of entries) {
      if (compact) {
        // Mobile: category on its own line, items indented below — no wasted padding
        lines.push(L(cy(cat)));
        lines.push(L(mu("  "), fg(list.join("  ·  "))));
      } else {
        lines.push(L(pad(cy(cat), maxCat), fg("  " + list.join("  ·  "))));
      }
    }
    lines.push("");
    lines.push(L(mu("// run `tech` to see animated proficiency bars")));
    return [t.rich(lines)];
  },
});

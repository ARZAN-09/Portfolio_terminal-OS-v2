import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L } from "./_helpers";
import { experience } from "@/lib/data/portfolio";

register({
  name: "experience",
  description: "Display the experience timeline.",
  aliases: ["exp"],
  run: () => {
    const lines: any[] = [];
    lines.push(L(c("Experience")));
    lines.push("");
    experience.forEach((x, i) => {
      lines.push(L(cy("●"), fg(` ${x.role}`), mu(` — ${x.org}`)));
      lines.push(L(mu("│"), y(`   ${x.period}`)));
      lines.push(L(mu("│"), mu(`   ${x.detail}`)));
      lines.push(L(mu("│"), fg("   tags: "), ...x.tags.flatMap((tag) => [c(` ${tag}`), mu("")]).slice(0, -1)));
      if (i < experience.length - 1) lines.push(L(mu("│")));
    });
    lines.push("");
    lines.push(L(mu("// building independently since 2023 — see `projects` for output")));
    return [t.rich(lines)];
  },
});

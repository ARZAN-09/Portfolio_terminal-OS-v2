import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L, pad } from "./_helpers";
import { profile, projects } from "@/lib/data/portfolio";

const GITHUB_URL = `https://github.com/${profile.githubUsername}`;

register({
  name: "github",
  description: "Show GitHub profile, repos, and contribution activity.",
  run: () => {
    const repos = projects;
    const langs = new Set<string>();
    repos.forEach((r) => r.technologies.forEach((l) => langs.add(l)));

    const lines: any[] = [];
    lines.push(L(c("●"), fg(` ${profile.githubUsername}`), mu("  /  Developer")));
    lines.push(L(mu("  " + GITHUB_URL)));
    lines.push(
      L(mu(`  ${repos.length} public repos · ${langs.size} languages · focuses: ${profile.focus.join(", ")}`))
    );
    lines.push("");
    lines.push(L(cy("Pinned repositories")));
    lines.push("");
    const maxName = Math.max(...repos.map((r) => r.slug.length), 8);
    repos.forEach((r) => {
      lines.push(L(mu("  "), pad(fg(r.slug), maxName), mu("   "), fg(r.tagline)));
      lines.push(L(mu("  "), pad(mu(""), maxName), mu("   "), cy(r.technologies.join(" · ")), mu(`   ${r.year}`)));
    });
    lines.push("");
    lines.push(L(cy("Contribution activity"), mu(" (derived from project shipping cadence)")));
    lines.push(L("  " + heatmap(repos)));
    lines.push(L(mu("  2024        2025        2026")));
    lines.push("");
    lines.push(L(mu("// open profile: "), cy(GITHUB_URL)));
    return [t.rich(lines)];
  },
});

/** Deterministic ASCII heatmap string derived from project years. */
function heatmap(repos: { year: string }[]): string {
  const years = ["2024", "2025", "2026"];
  const intensity: Record<string, number> = { "2024": 0, "2025": 0, "2026": 0 };
  repos.forEach((r) => {
    if (intensity[r.year] !== undefined) intensity[r.year]++;
  });
  const glyphs = ["·", "░", "▒", "▓", "█"];
  let out = "";
  for (let row = 0; row < 5; row++) {
    let line = "";
    for (let col = 0; col < 30; col++) {
      const yr = years[Math.min(2, Math.floor(col / 10))] ?? "2025";
      const base = intensity[yr] ?? 0;
      const seed = (row * 31 + col * 17 + base * 7) % 13;
      const level = seed < 5 ? 0 : Math.min(4, base + (seed % 2));
      line += glyphs[level] + " ";
    }
    out += (row === 0 ? "" : "  ") + line + "\n";
  }
  return out.trimEnd();
}

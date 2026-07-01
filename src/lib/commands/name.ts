import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L, pad } from "./_helpers";
import { profile } from "@/lib/data/portfolio";

register({
  name: "name",
  description: "Show identity card: name, role, tagline, location, status.",
  run: () => {
    const w = 12;
    return [
      t.rich([
        L(mu("┌─ identity ──────────────────────────────────┐")),
        L(mu("│"), pad(cy("Name"), w), fg(profile.name.padEnd(32)), mu("│")),
        L(mu("│"), pad(cy("Role"), w), fg(profile.role.padEnd(32)), mu("│")),
        L(mu("│"), pad(cy("Tagline"), w), fg(trunc(profile.tagline, 32).padEnd(32)), mu("│")),
        L(mu("│"), pad(cy("Location"), w), fg(profile.location.padEnd(32)), mu("│")),
        L(mu("│"), pad(cy("Status"), w), y(profile.status.padEnd(32)), mu("│")),
        L(mu("└─────────────────────────────────────────────┘")),
        L(""),
        L(mu("// try `whoami` for a one-liner or `neofetch` for system specs")),
      ]),
    ];
  },
});

function trunc(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

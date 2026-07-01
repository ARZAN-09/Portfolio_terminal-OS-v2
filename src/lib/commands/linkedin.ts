import { register } from "@/lib/shell/registry";
import { t, c, cy, mu, fg, L } from "./_helpers";
import { profile } from "@/lib/data/portfolio";

const GITHUB_URL = `https://github.com/${profile.githubUsername}`;

register({
  name: "linkedin",
  description: "Show LinkedIn / professional profile.",
  run: () => [
    t.rich([
      L(c("LinkedIn"), mu("  /  professional profile")),
      L(""),
      L(cy("Name:"), fg(`    ${profile.name}`)),
      L(cy("Role:"), fg(`    ${profile.role}`)),
      L(cy("Headline:"), fg(`${profile.tagline}`)),
      L(cy("Location:"), fg(`${profile.location}`)),
      L(""),
      L(mu("// I keep my professional presence on GitHub — connect there:")),
      L(fg("    " + GITHUB_URL)),
      L(""),
      L(mu("// or email me directly: "), fg(profile.email)),
    ]),
  ],
});

import { register } from "@/lib/shell/registry";
import { t } from "./_helpers";
import { certifications } from "@/lib/data/portfolio";

register({
  name: "certifications",
  description: "List certifications.",
  aliases: ["certs"],
  run: () => [
    t.md(
      `# Certifications\n\n${certifications
        .map((c) => `- **${c.name}** — ${c.issuer} (${c.year})`)
        .join("\n")}`
    ),
  ],
});

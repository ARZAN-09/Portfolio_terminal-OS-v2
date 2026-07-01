import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L } from "./_helpers";
import { education, certifications } from "@/lib/data/portfolio";

register({
  name: "education",
  description: "Display the education timeline.",
  aliases: ["edu"],
  run: () => {
    const lines: any[] = [];
    lines.push(L(c("Education Timeline")));
    lines.push("");
    education.forEach((e, i) => {
      lines.push(L(cy("●"), fg(" " + e.school)));
      lines.push(L(mu("│"), fg("   " + e.qualification)));
      lines.push(L(mu("│"), y("   " + e.period)));
      lines.push(L(mu("│"), mu("   " + wrap(e.detail, "│   "))));
      if (i < education.length - 1) lines.push(L(mu("│")));
    });
    lines.push("");
    lines.push(L(c("Certifications")));
    certifications.forEach((cert) => {
      lines.push(L(cy("▸"), fg(" " + cert.name), mu(`  (${cert.issuer}, ${cert.year})`)));
    });
    return [t.rich(lines)];
  },
});

function wrap(text: string, _pad: string): string {
  return text; // kept simple; long lines wrap naturally in <pre> via whitespace-pre-wrap
}

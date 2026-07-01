import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, L } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";
import { profile, contacts } from "@/lib/data/portfolio";

register({
  name: "resume",
  description: "Preview résumé. Use --download to save as resume.md.",
  usage: "resume [--download]",
  run: ({ flags, compact }) => {
    const file = fs.cat("/", "resume.md");
    if (!file) return [t.text("resume: file not found", "text-term-error")];

    if (flags.download) {
      downloadText("resume.md", file.content);
      return [t.rich([L(c("✓ Downloaded "), fg("resume.md"), mu(" to your machine."))])];
    }
    const divider = compact
      ? "─".repeat(30)
      : "──────────────────────────────────────────────";
    return [
      t.rich([
        L(c("Résumé preview"), mu(` — ${profile.name}`)),
        L(mu(`${profile.role} · ${profile.location}`)),
        L(mu(contacts.email)),
        L(mu(divider)),
      ]),
      t.md(file.content),
      t.rich([L(""), L(mu("// type "), fg("resume --download"), mu(" to save this as a file."))]),
    ];
  },
});

function downloadText(filename: string, content: string) {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

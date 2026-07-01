import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, L } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";
import { projects } from "@/lib/data/portfolio";

register({
  name: "project",
  description: "Open a project's markdown file (projects/<name>.md).",
  usage: "project <name>",
  run: ({ args, cwd }) => {
    if (!args[0]) {
      return [
        t.rich([
          L(mu("usage: "), fg("project <name>")),
          L(""),
          L(mu("available projects:")),
          ...projects.map((p) => L(c(`  ${p.slug}`), fg(`  — ${p.name}`))),
        ]),
      ];
    }
    // Allow with or without .md extension
    let slug = args[0].replace(/\.md$/, "");
    // Fuzzy-ish: accept name with spaces or different case
    if (!projects.find((p) => p.slug === slug)) {
      const match = projects.find(
        (p) =>
          p.slug === slug.toLowerCase() ||
          p.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
      );
      if (match) slug = match.slug;
    }
    const target = `/projects/${slug}.md`;
    const file = fs.cat(cwd, target);
    if (!file) {
      return [
        t.rich([
          L(mu(`project: '${args[0]}' not found.`), fg("")),
          L(mu("did you mean:")),
          ...projects.slice(0, 4).map((p) => L(c(`  ${p.slug}`), fg(`  — ${p.name}`))),
        ]),
      ];
    }
    // Render the project markdown, with a header line
    return [
      t.rich([L(mu(`cat ${target}`), fg(""))]),
      t.md(file.content),
    ];
  },
  complete: () => projects.map((p) => p.slug),
});

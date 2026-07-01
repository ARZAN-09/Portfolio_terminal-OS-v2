import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";
import { projects, skills, techProficiency, about } from "@/lib/data/portfolio";
import Fuse from "fuse.js";

interface SearchDoc {
  type: "project" | "skill" | "file" | "about";
  title: string;
  subtitle: string;
  path?: string;
  keywords: string;
}

function buildIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  projects.forEach((p) =>
    docs.push({
      type: "project",
      title: p.name,
      subtitle: p.tagline,
      path: `projects/${p.slug}`,
      keywords: [p.slug, p.name, p.tagline, p.description, p.technologies.join(" "), p.features.join(" ")].join(" "),
    })
  );
  for (const [cat, list] of Object.entries(skills)) {
    list.forEach((s) =>
      docs.push({
        type: "skill",
        title: s,
        subtitle: `skill · ${cat}`,
        keywords: `${s} ${cat}`,
      })
    );
  }
  techProficiency.forEach((t) =>
    docs.push({ type: "skill", title: t.name, subtitle: `tech · ${t.category} · ${t.level}%`, keywords: t.name })
  );
  docs.push({ type: "about", title: "About Me", subtitle: "who I am", keywords: about });
  for (const f of fs.allFiles()) {
    docs.push({
      type: "file",
      title: f.name,
      subtitle: `file · ${f.path}`,
      path: f.path,
      keywords: `${f.name} ${f.content.slice(0, 400)}`,
    });
  }
  return docs;
}

let fuse: Fuse<SearchDoc> | null = null;
function getFuse() {
  if (!fuse) {
    fuse = new Fuse(buildIndex(), {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "subtitle", weight: 0.2 },
        { name: "keywords", weight: 0.3 },
      ],
      threshold: 0.42,
      ignoreLocation: true,
      includeMatches: true,
    });
  }
  return fuse;
}

register({
  name: "search",
  description: "Fuzzy-search across projects, skills, files, and about.",
  usage: "search <query>",
  run: ({ args }) => {
    if (!args[0]) return [t.rich([L(mu("usage: "), fg("search <query>"))])];
    const query = args.join(" ");
    const results = getFuse().search(query).slice(0, 12);
    if (!results.length) {
      return [t.rich([L(mu(`No matches for '${query}'.`))])];
    }
    const typeColor: Record<string, (s: string) => any> = {
      project: y,
      skill: cy,
      file: c,
      about: c,
    };
    const lines: any[] = [
      L(c("Search results"), mu(` for '${query}' — ${results.length} match(es)`)),
      L(""),
    ];
    results.forEach((r, i) => {
      const d = r.item;
      const idx = String(i + 1).padStart(2, "0");
      lines.push(
        L(mu(`${idx} `), typeColor[d.type]?.(`[${d.type}]`) ?? fg(`[${d.type}]`), fg("  " + d.title), mu("  " + d.subtitle))
      );
      if (d.path) lines.push(L(mu("       → "), cy(d.path)));
    });
    lines.push(L(""));
    lines.push(L(mu("// open a file with "), fg("cat <path>"), mu(" or a project with "), fg("project <slug>")));
    return [t.rich(lines)];
  },
});

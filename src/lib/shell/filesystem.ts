import {
  about,
  certifications,
  contacts,
  education,
  experience,
  profile,
  projects,
  skills,
  socials,
  techProficiency,
} from "@/lib/data/portfolio";

export interface VFSNode {
  name: string;
  type: "file" | "dir";
  content?: string;
  children?: Record<string, VFSNode>;
}

/* ------------------------------------------------------------------ */
/* Markdown content builders for virtual files                         */
/* ------------------------------------------------------------------ */

function projectToMarkdown(slug: string): string {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return `# ${slug}\n\n_File not found._`;
  return `# ${p.name}

> ${p.tagline}

**Status:** ${p.status}  ·  **Year:** ${p.year}  ·  **Repo:** [${p.github}](${p.github})

## Description

${p.description}

## Features

${p.features.map((f) => `- ${f}`).join("\n")}

## Technologies

${p.technologies.map((t) => `\`${t}\``).join(" · ")}

## Challenges

${p.challenges}

## Lessons Learned

${p.lessons}

## Links

- **GitHub:** [${p.github}](${p.github})
`;
}

const resumeMd = `# Arzan S. S. — Résumé

**${profile.role}** · ${profile.location}
${profile.email} · ${contacts.github}

---

## Profile

${profile.tagline}

## Focus Areas

${profile.focus.map((f) => `- ${f}`).join("\n")}

## Education

${education
  .map(
    (e) =>
      `### ${e.school}  ·  ${e.period}\n**${e.qualification}** — ${e.detail}`
  )
  .join("\n\n")}

## Experience

${experience
  .map(
    (x) =>
      `### ${x.role} — ${x.org}  ·  ${x.period}\n${x.detail}\n\n_Tags: ${x.tags
        .map((t) => `\`${t}\``)
        .join(" ")}_`
  )
  .join("\n\n")}

## Skills

${Object.entries(skills)
  .map(([cat, list]) => `**${cat}:** ${list.join(", ")}`)
  .join("\n")}

## Certifications

${certifications.map((c) => `- **${c.name}** — ${c.issuer} (${c.year})`).join("\n")}

## Projects

${projects
  .map(
    (p) =>
      `- **${p.name}** (${p.year}) — ${p.tagline}  →  ${p.github}`
  )
  .join("\n")}

---

> Tip: type \`resume --download\` to download this as a file, or \`projects\` to browse interactively.
`;

const educationMd = `# Education

${education
  .map(
    (e) => `## ${e.school}
**${e.qualification}**  ·  ${e.period}

${e.detail}
`
  )
  .join("\n")}

## Certifications

${certifications.map((c) => `- **${c.name}** — ${c.issuer} (${c.year})`).join("\n")}
`;

const experienceMd = `# Experience

${experience
  .map(
    (x) => `## ${x.role} — ${x.org}
**${x.period}**

${x.detail}

_Tags: ${x.tags.map((t) => `\`${t}\``).join(" ")}_
`
  )
  .join("\n")}
`;

const contactMd = `# Contact

| Channel | Value |
|---------|-------|
| Email   | ${contacts.email} |
| Phone   | ${contacts.phone} |
| Location| ${contacts.location} |
| GitHub  | [${contacts.github}](${contacts.github}) |
| Instagram | [${contacts.instagram}](${contacts.instagram}) |
| Twitter / X | [${contacts.twitter}](${contacts.twitter}) |

> Tip: type \`email\` to open an in-terminal email composer.
`;

const socialsMd = `# Socials

${socials
  .map((s) => `- **${s.label}** — ${s.handle} → ${s.url}`)
  .join("\n")}
`;

const certificationsMd = `# Certifications

${certifications
  .map(
    (c) =>
      `## ${c.name}\n**${c.issuer}** · ${c.year}\n`
  )
  .join("\n")}
`;

const skillsJson = JSON.stringify(
  {
    ...skills,
    _proficiency: techProficiency,
  },
  null,
  2
);

/* ------------------------------------------------------------------ */
/* Tree construction                                                   */
/* ------------------------------------------------------------------ */

function file(name: string, content: string): VFSNode {
  return { name, type: "file", content };
}
function dir(name: string, children: Record<string, VFSNode>): VFSNode {
  return { name, type: "dir", children };
}

function buildProjectsDir(): Record<string, VFSNode> {
  const out: Record<string, VFSNode> = {};
  for (const p of projects) {
    out[`${p.slug}.md`] = file(`${p.slug}.md`, projectToMarkdown(p.slug));
  }
  return out;
}

export function buildFilesystem(): VFSNode {
  return dir("/", {
    "about.md": file("about.md", about),
    "resume.md": file("resume.md", resumeMd),
    "skills.json": file("skills.json", skillsJson),
    "education.md": file("education.md", educationMd),
    "experience.md": file("experience.md", experienceMd),
    "contact.md": file("contact.md", contactMd),
    "socials.md": file("socials.md", socialsMd),
    "certifications.md": file("certifications.md", certificationsMd),
    projects: dir("projects", buildProjectsDir()),
  });
}

/* ------------------------------------------------------------------ */
/* Path helpers (POSIX-ish, read-only)                                */
/* ------------------------------------------------------------------ */

const ROOT = buildFilesystem();

function normalize(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return "/" + stack.join("/");
}

export function resolvePath(cwd: string, input: string): string {
  if (input.startsWith("/")) return normalize(input);
  if (input === "~" || input.startsWith("~/")) {
    return normalize("/" + input.slice(input.startsWith("~/") ? 2 : 1));
  }
  return normalize(cwd === "/" ? "/" + input : cwd + "/" + input);
}

function getNode(path: string): VFSNode | null {
  const norm = normalize(path);
  if (norm === "/") return ROOT;
  const parts = norm.split("/").filter(Boolean);
  let node: VFSNode = ROOT;
  for (const part of parts) {
    if (node.type !== "dir" || !node.children?.[part]) return null;
    node = node.children[part];
  }
  return node;
}

export const fs = {
  root: ROOT,
  pwd(cwd: string): string {
    return normalize(cwd);
  },
  ls(cwd: string, target?: string): VFSNode[] | null {
    const path = target ? resolvePath(cwd, target) : cwd;
    const node = getNode(path);
    if (!node) return null;
    if (node.type === "file") return [node];
    return Object.values(node.children ?? {}).sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  },
  cd(cwd: string, target?: string): string | null {
    if (!target || target === "~") return "/";
    const path = resolvePath(cwd, target);
    const node = getNode(path);
    if (!node) return null;
    if (node.type !== "dir") return null;
    return normalize(path);
  },
  cat(cwd: string, target: string): { content: string; name: string } | null {
    const path = resolvePath(cwd, target);
    const node = getNode(path);
    if (!node || node.type !== "file") return null;
    return { content: node.content ?? "", name: node.name };
  },
  tree(cwd: string, target?: string): string | null {
    const path = target ? resolvePath(cwd, target) : cwd;
    const node = getNode(path);
    if (!node) return null;
    const lines: string[] = [normalize(path) === "/" ? "." : node.name];
    const walk = (n: VFSNode, prefix: string) => {
      const children = n.type === "dir" ? Object.values(n.children ?? {}) : [];
      children.forEach((child, i) => {
        const last = i === children.length - 1;
        lines.push(`${prefix}${last ? "└── " : "├── "}${child.name}${child.type === "dir" ? "/" : ""}`);
        if (child.type === "dir") {
          walk(child, prefix + (last ? "    " : "│   "));
        }
      });
    };
    walk(node, "");
    return lines.join("\n");
  },
  find(cwd: string, query: string): string[] {
    const q = query.toLowerCase();
    const results: string[] = [];
    const walk = (n: VFSNode, path: string) => {
      if (n.name !== "/" && n.name.toLowerCase().includes(q)) {
        results.push(path === "/" ? "/" + n.name : path + "/" + n.name);
      }
      if (n.type === "dir") {
        for (const child of Object.values(n.children ?? {})) {
          walk(child, path === "/" ? "/" + n.name : path + "/" + n.name);
        }
      }
    };
    walk(ROOT, "");
    return results;
  },
  grep(
    cwd: string,
    pattern: string,
    target: string
  ): { file: string; matches: { line: number; text: string }[] }[] | null {
    const path = resolvePath(cwd, target);
    const node = getNode(path);
    if (!node) return null;
    const files: { name: string; content: string }[] = [];
    if (node.type === "file") {
      files.push({ name: node.name, content: node.content ?? "" });
    } else {
      const collect = (d: VFSNode) => {
        for (const c of Object.values(d.children ?? {})) {
          if (c.type === "file") files.push({ name: c.name, content: c.content ?? "" });
          else collect(c);
        }
      };
      collect(node);
    }
    let re: RegExp;
    try {
      re = new RegExp(pattern, "gi");
    } catch {
      re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    }
    const out: { file: string; matches: { line: number; text: string }[] }[] = [];
    for (const f of files) {
      const lines = f.content.split("\n");
      const matches: { line: number; text: string }[] = [];
      lines.forEach((l, i) => {
        if (re.test(l)) matches.push({ line: i + 1, text: l });
        re.lastIndex = 0;
      });
      if (matches.length) out.push({ file: f.name, matches });
    }
    return out;
  },
  /** Search every file's content + names for the `search` command (fuzzy). */
  allFiles(): { path: string; name: string; content: string }[] {
    const out: { path: string; name: string; content: string }[] = [];
    const walk = (n: VFSNode, path: string) => {
      if (n.type === "file") {
        out.push({ path: path === "/" ? "/" + n.name : path + "/" + n.name, name: n.name, content: n.content ?? "" });
      } else {
        for (const c of Object.values(n.children ?? {})) {
          walk(c, path === "/" ? "" : path);
        }
      }
    };
    // walk root specially
    for (const c of Object.values(ROOT.children ?? {})) {
      walk(c, "");
    }
    return out;
  },
};

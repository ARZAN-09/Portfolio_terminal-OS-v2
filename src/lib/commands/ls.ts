import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L, pad } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";

register({
  name: "ls",
  description: "List directory contents. Flags: -l (long), -a (all).",
  usage: "ls [-l] [path]",
  run: ({ args, flags, cwd }) => {
    const target = args.find((a) => !a.startsWith("-"));
    const entries = fs.ls(cwd, target);
    if (entries === null) {
      return [t.rich([L(mu(`ls: cannot access '${target}': No such file or directory`))])];
    }
    if (flags.l) {
      const lines: any[] = [];
      lines.push(L(mu(`total ${entries.length}`)));
      for (const e of entries) {
        const isDir = e.type === "dir";
        const perm = isDir ? cy("drwxr-xr-x") : mu("-rw-r--r--");
        lines.push(L(perm, fg("  arzan  staff  "), pad(fg(String((e.content?.length ?? 0).toString().padStart(6))), 8), fg("  " + (isDir ? cy(e.name + "/") : fileColor(e.name)))));
      }
      return [t.rich(lines)];
    }
    // compact view
    const segs: any[] = [];
    entries.forEach((e, i) => {
      if (e.type === "dir") segs.push(cy(e.name + "/"));
      else segs.push(fileColorSeg(e.name));
    });
    // render as wrapped grid lines
    return [t.rich([L(...segs.map((s, i) => (i < segs.length - 1 ? { ...s, text: s.text + "  " } : s)))])];
  },
});

function fileColor(name: string): string {
  return name;
}
function fileColorSeg(name: string) {
  if (name.endsWith(".md")) return c(name);
  if (name.endsWith(".json")) return y(name);
  return fg(name);
}

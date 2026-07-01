import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";
import type { Line, Seg } from "@/lib/shell/types";

register({
  name: "grep",
  description: "Search file contents. Usage: grep <pattern> <file|dir>",
  usage: "grep <pattern> <target>",
  run: ({ args, cwd }) => {
    if (args.length < 2) {
      return [t.rich([L(mu("usage: grep <pattern> <file|dir>"))])];
    }
    const [pattern, target] = args;
    const result = fs.grep(cwd, pattern, target);
    if (result === null) {
      return [t.rich([L(mu(`grep: ${target}: No such file or directory`))])];
    }
    if (!result.length) {
      return [t.rich([L(mu(`grep: no matches for /${pattern}/ in ${target}`))])];
    }
    let re: RegExp;
    try {
      re = new RegExp(pattern, "gi");
    } catch {
      re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    }
    const lines: Line[] = [L(c("Grep"), mu(` /${pattern}/ in ${target}`)), L("")];
    for (const f of result) {
      lines.push(L(mu(`▼ ${f.file}`)));
      for (const m of f.matches) {
        lines.push(highlight(m.text, re, m.line));
      }
      lines.push("");
    }
    return [t.rich(lines)];
  },
});

function highlight(text: string, re: RegExp, lineNo: number): Seg[] {
  const segs: Seg[] = [mu(`  ${String(lineNo).padStart(3, " ")}: `)];
  re.lastIndex = 0;
  let last = 0;
  let match: RegExpExecArray | null;
  const globalRe = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  while ((match = globalRe.exec(text)) !== null) {
    if (match.index > last) segs.push(fg(text.slice(last, match.index)));
    segs.push(y(match[0]));
    last = match.index + match[0].length;
    if (match[0].length === 0) globalRe.lastIndex++;
  }
  if (last < text.length) segs.push(fg(text.slice(last)));
  return segs;
}

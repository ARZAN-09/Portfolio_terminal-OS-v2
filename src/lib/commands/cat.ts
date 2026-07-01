import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, er, L } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";

register({
  name: "cat",
  description: "Print a file. .md renders as markdown, .json as text.",
  usage: "cat <file>",
  run: ({ args, cwd }) => {
    if (!args[0]) return [t.rich([L(mu("usage: cat <file>"))])];
    const file = fs.cat(cwd, args[0]);
    if (!file) {
      return [t.rich([L(er(`cat: ${args[0]}: No such file or directory`))])];
    }
    if (file.name.endsWith(".md")) {
      return [t.rich([L(mu(`── ${file.name} ──`))]), t.md(file.content)];
    }
    return [t.text(file.content, "text-term-fg")];
  },
});

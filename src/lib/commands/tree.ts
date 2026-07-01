import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, L } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";

register({
  name: "tree",
  description: "Draw the virtual filesystem tree.",
  usage: "tree [path]",
  run: ({ args, cwd }) => {
    const out = fs.tree(cwd, args[0]);
    if (!out) return [t.rich([L(mu(`tree: ${args[0] ?? "."}: not found`))])];
    return [t.text(out, "text-term-fg")];
  },
});

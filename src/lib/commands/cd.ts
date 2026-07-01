import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, er, L } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";

register({
  name: "cd",
  description: "Change directory.",
  usage: "cd [path]",
  run: ({ args, cwd, actions }) => {
    const target = args[0] ?? "~";
    const next = fs.cd(cwd, target);
    if (next === null) {
      return [t.rich([L(er(`cd: no such directory: ${target}`))])];
    }
    actions.setCwd(next);
    return [];
  },
});

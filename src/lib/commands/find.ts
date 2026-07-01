import { register } from "@/lib/shell/registry";
import { t, c, cy, mu, fg, L } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";

register({
  name: "find",
  description: "Find files & directories by name. Usage: find <query>",
  usage: "find <query>",
  run: ({ args }) => {
    if (!args[0]) return [t.rich([L(mu("usage: find <query>"))])];
    const results = fs.find("/", args[0]);
    if (!results.length) {
      return [t.rich([L(mu(`find: no matches for '${args[0]}'`))])];
    }
    const lines: any[] = [L(c("Find"), mu(` — '${args[0]}' (${results.length})`)), L("")];
    results.forEach((r) => lines.push(L(cy(r))));
    return [t.rich(lines)];
  },
});

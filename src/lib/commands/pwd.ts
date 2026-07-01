import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, L } from "./_helpers";
import { fs } from "@/lib/shell/filesystem";

register({
  name: "pwd",
  description: "Print working directory.",
  run: ({ cwd }) => [t.rich([L(c("pwd"), fg(" → " + fs.pwd(cwd)))])],
});

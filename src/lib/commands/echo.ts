import { register } from "@/lib/shell/registry";
import { t, fg, L } from "./_helpers";

register({
  name: "echo",
  description: "Print arguments back to the terminal.",
  usage: "echo <text...>",
  run: ({ args, raw }) => {
    // strip leading "echo"
    const text = raw.replace(/^\s*echo\s*/, "");
    return [t.rich([L(fg(text))])];
  },
});

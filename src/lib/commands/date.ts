import { register } from "@/lib/shell/registry";
import { t, c, cy, fg, L } from "./_helpers";

register({
  name: "date",
  description: "Print the current date and time.",
  run: () => {
    const now = new Date();
    return [
      t.rich([
        L(cy(now.toLocaleString("en-US", { dateStyle: "full", timeStyle: "medium" }))),
        L(c("epoch:"), fg(" " + Math.floor(now.getTime() / 1000).toString())),
        L(c("tz:"), fg(" " + Intl.DateTimeFormat().resolvedOptions().timeZone)),
      ]),
    ];
  },
});

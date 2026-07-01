import { register } from "@/lib/shell/registry";
import { t } from "./_helpers";
import { about } from "@/lib/data/portfolio";

register({
  name: "about",
  description: "Render the About Me markdown.",
  aliases: ["bio"],
  run: () => [t.md(about)],
});

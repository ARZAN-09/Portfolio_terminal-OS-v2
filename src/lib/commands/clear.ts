import { register } from "@/lib/shell/registry";
import { t } from "./_helpers";

register({
  name: "clear",
  description: "Clear the terminal screen.",
  aliases: ["cls"],
  run: ({ actions }) => {
    actions.clear();
    return [];
  },
});

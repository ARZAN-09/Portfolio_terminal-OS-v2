import { register } from "@/lib/shell/registry";
import { t } from "./_helpers";
import { techProficiency } from "@/lib/data/portfolio";

register({
  name: "tech",
  description: "Render animated proficiency bars for each technology.",
  run: () => [t.comp("techBars", { items: techProficiency })],
});

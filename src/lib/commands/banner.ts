import { register } from "@/lib/shell/registry";
import { t } from "./_helpers";
import { banner } from "@/lib/data/portfolio";

register({
  name: "banner",
  description: "Print the large ASCII portfolio banner.",
  run: () => [t.glow(banner, "text-term-accent")],
});

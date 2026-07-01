import { register } from "@/lib/shell/registry";
import { t } from "./_helpers";

register({
  name: "neofetch",
  description: "Display system info with ASCII art (PortfolioOS neofetch).",
  run: () => [t.comp("neofetch")],
});

import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, L } from "./_helpers";

register({
  name: "exit",
  description: "Log out of the shell (reboots PortfolioOS).",
  run: ({ actions }) => {
    setTimeout(() => actions.reboot(), 400);
    return [
      t.rich([
        L(c("logout"), mu(" — session ending…")),
        L(mu("// restarting PortfolioOS. See you on the other side.")),
      ]),
    ];
  },
});

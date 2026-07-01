import { register } from "@/lib/shell/registry";
import { t, c, cy, mu, fg, L } from "./_helpers";
import { useShell } from "@/lib/shell/store";

register({
  name: "history",
  description: "Show command history.",
  run: () => {
    const hist = useShell.getState().commandHistory;
    if (!hist.length) return [t.rich([L(mu("history: empty — start typing!"))])];
    const lines = hist.map((h, i) => L(mu(String(i + 1).padStart(4, " ") + "  "), fg(h)));
    return [t.rich([L(c("History")), L(""), ...lines])];
  },
});

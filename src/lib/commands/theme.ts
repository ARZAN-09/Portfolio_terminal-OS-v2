import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L, pad } from "./_helpers";
import { THEMES } from "@/lib/shell/themes";
import { useShell } from "@/lib/shell/store";

register({
  name: "theme",
  description: "List themes or switch theme. Usage: theme [name]",
  usage: "theme [name]",
  run: ({ args, actions }) => {
    const current = useShell.getState().theme;
    if (!args[0]) {
      const lines: any[] = [L(c("Themes"), mu(" — type `theme <name>` to switch")), L("")];
      const w = 14;
      THEMES.forEach((th) => {
        const marker = th.id === current ? y("▸ ") : mu("  ");
        lines.push(L(marker, pad(cy(th.name), w), mu(th.blurb)));
      });
      lines.push(L(""));
      lines.push(L(mu(`current: `), fg(current)));
      return [t.rich(lines)];
    }
    const match = THEMES.find(
      (th) => th.id === args[0].toLowerCase() || th.name.toLowerCase() === args[0].toLowerCase()
    );
    if (!match) {
      return [
        t.rich([
          L(mu(`theme: '${args[0]}' not found.`), fg("")),
          L(mu("available:"), fg(" " + THEMES.map((t) => t.id).join(", "))),
        ]),
      ];
    }
    actions.setTheme(match.id);
    return [t.rich([L(c("✓ theme → "), fg(match.name), mu(` (${match.blurb})`))])];
  },
  complete: () => THEMES.map((t) => t.id),
});

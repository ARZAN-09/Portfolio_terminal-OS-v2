import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, L } from "./_helpers";
import { useShell } from "@/lib/shell/store";

register({
  name: "sound",
  description: "Toggle the typing sound effect.",
  usage: "sound [on|off]",
  run: ({ args, actions }) => {
    const cur = useShell.getState().sound;
    let next = !cur;
    if (args[0] === "on") next = true;
    if (args[0] === "off") next = false;
    if (next === cur && args[0]) {
      return [t.rich([L(mu(`sound is already ${cur ? "on" : "off"}.`))])];
    }
    if (next !== cur) actions.toggleSound();
    return [t.rich([L(c("✓ sound "), fg(next ? "ON" : "OFF"), mu(next ? "  // click-clack" : "  // silence"))])];
  },
});

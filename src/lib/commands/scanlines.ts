import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, L } from "./_helpers";
import { useShell } from "@/lib/shell/store";

register({
  name: "scanlines",
  description: "Toggle the CRT scanlines overlay.",
  run: ({ actions }) => {
    actions.toggleScanlines();
    const on = useShell.getState().scanlines;
    return [t.rich([L(c("✓ scanlines "), fg(on ? "ON" : "OFF"), mu(on ? "  // welcome to the CRT era" : "  // clean mode"))])];
  },
});

import { register } from "@/lib/shell/registry";
import { t, c, mu, fg, L } from "./_helpers";
import { profile } from "@/lib/data/portfolio";

register({
  name: "email",
  description: "Open an in-terminal email composer (Ctrl+Enter to send).",
  run: ({ actions }) => {
    actions.setMode("email");
    return [
      t.rich([
        L(c("✉  Opening terminal email composer…")),
        L(mu("// press Escape to cancel, Ctrl+Enter to send")),
      ]),
    ];
  },
});

export const EMAIL_TO = profile.email;

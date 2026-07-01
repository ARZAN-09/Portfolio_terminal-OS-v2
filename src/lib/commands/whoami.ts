import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L } from "./_helpers";
import { profile } from "@/lib/data/portfolio";

register({
  name: "whoami",
  description: "Print a concise biography.",
  run: () => [
    t.rich([
      L(c(profile.name), fg(` <${profile.role}>`)),
      L(mu(profile.tagline)),
      L(""),
      L(cy("focus:"), fg(" " + profile.focus.join(" · "))),
      L(cy("based:"), fg(" " + profile.location)),
      L(cy("status:"), y(" " + profile.status)),
      L(""),
      L(mu("// type `about` for the long version, `neofetch` for system info")),
    ]),
  ],
});

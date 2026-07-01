import { register, getCommand, commandNames } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L } from "./_helpers";

register({
  name: "man",
  description: "Display the manual page for a command.",
  usage: "man <command>",
  run: ({ args }) => {
    if (!args[0]) {
      return [t.rich([L(mu("What manual page do you want?")), L(mu(`Available: ${commandNames().join(", ")}`))])];
    }
    const cmd = getCommand(args[0]);
    if (!cmd) {
      return [t.rich([L(mu(`No manual entry for ${args[0]}`))])];
    }
    return [
      t.rich([
        L(mu(`${cmd.name}(1)`), fg("".padEnd(20)), mu("PortfolioOS Manual"), fg("".padStart(8)), mu(`${cmd.name}(1)`)),
        L(""),
        L(c("NAME")),
        L(fg(`    ${cmd.name} — ${cmd.description}`)),
        L(""),
        L(c("SYNOPSIS")),
        L(fg(`    ${cmd.usage ?? cmd.name}`)),
        ...(cmd.aliases?.length
          ? [L(""), L(c("ALIASES")), L(fg(`    ${cmd.aliases.join(", ")}`))]
          : []),
        L(""),
        L(c("DESCRIPTION")),
        L(fg(`    ${cmd.description}`)),
        L(""),
        L(y("SEE ALSO")),
        L(mu(`    help, ${commandNames().filter((n) => n !== cmd.name).slice(0, 6).join(", ")}`)),
        L(""),
        L(mu(`PortfolioOS ${cmd.name}  ${new Date().getFullYear()}`)),
      ]),
    ];
  },
  complete: () => commandNames(),
});

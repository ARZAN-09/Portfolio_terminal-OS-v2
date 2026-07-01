import { register, getCommand, commandNames } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, L, pad } from "./_helpers";
import { THEMES } from "@/lib/shell/themes";
import { projects } from "@/lib/data/portfolio";
import type { Line } from "@/lib/shell/types";

register({
  name: "help",
  description: "List all available commands (or details for one command).",
  usage: "help [command]",
  run: ({ args, compact }) => {
    if (args[0]) {
      const cmd = getCommand(args[0]);
      if (!cmd) return [t.text(`help: no such command '${args[0]}'`, "text-term-error")];
      return [
        t.rich([
          L(c(cmd.name), fg(` — ${cmd.description}`)),
          L(mu("Usage:"), fg(" " + (cmd.usage ?? cmd.name))),
          ...(cmd.aliases?.length ? [L(mu("Aliases:"), fg(" " + cmd.aliases.join(", ")))] : []),
        ]),
      ];
    }

    const groups: { title: string; cmds: string[] }[] = [
      { title: "IDENTITY", cmds: ["whoami", "about", "name", "neofetch", "banner"] },
      { title: "PORTFOLIO", cmds: ["skills", "tech", "projects", "project", "resume", "education", "experience", "certifications", "contact", "socials"] },
      { title: "LINKS", cmds: ["github", "linkedin", "email"] },
      { title: "FILESYSTEM", cmds: ["pwd", "ls", "cd", "cat", "tree", "find", "grep"] },
      { title: "SHELL", cmds: ["help", "man", "history", "clear", "echo", "date", "uptime", "exit"] },
      { title: "SETTINGS", cmds: ["theme", "scanlines", "sound"] },
      { title: "SEARCH", cmds: ["search"] },
    ];
    const maxName = Math.max(...commandNames().map((x) => x.length), 12);
    const lines: Line[] = [];
    lines.push(L(cy("Available commands"), mu(" — type `help <command>` for usage")));
    lines.push("");
    for (const g of groups) {
      lines.push(L(y(g.title)));
      for (const name of g.cmds) {
        const def = getCommand(name);
        const desc = def?.description ?? "";
        if (compact) {
          // Mobile: command name + description with minimal gap, wraps naturally
          lines.push(L(mu("  "), fg(name), mu("  "), fg(desc)));
        } else {
          lines.push(L(mu("  "), pad(fg(name), maxName), mu("  " + desc)));
        }
      }
      lines.push("");
    }
    lines.push(L(mu("  Easter eggs:"), fg(" sudo, matrix, coffee, fortune, hello, rm, yes, make, hack, konami")));
    lines.push(
      L(
        mu("  Tip:"),
        fg(` theme has ${THEMES.length} options · scanlines toggles CRT · projects lists ${projects.length} builds`)
      )
    );
    return [t.rich(lines)];
  },
});

import type { CommandDef } from "./types";
import { suggest } from "./parser";

/**
 * Central command registry. Each command registers itself by calling
 * `register()` from its own file. The shell imports all command modules
 * (see `commands/index.ts`) which triggers registration.
 */

const commands = new Map<string, CommandDef>();

export function register(def: CommandDef) {
  commands.set(def.name, def);
  for (const alias of def.aliases ?? []) {
    commands.set(alias, def);
  }
}

export function getCommand(name: string): CommandDef | undefined {
  return commands.get(name);
}

export function allCommands(): CommandDef[] {
  // dedupe aliases — keep only the canonical (first registration per def)
  const seen = new Set<CommandDef>();
  const out: CommandDef[] = [];
  for (const cmd of commands.values()) {
    if (seen.has(cmd)) continue;
    seen.add(cmd);
    out.push(cmd);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function commandNames(): string[] {
  return allCommands().map((c) => c.name);
}

export function suggestionsFor(input: string): string[] {
  return suggest(input, commandNames());
}

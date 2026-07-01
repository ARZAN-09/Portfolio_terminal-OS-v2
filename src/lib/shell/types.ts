import type { ComponentType } from "react";

/** A colored text segment within a single line. */
export interface Seg {
  text: string;
  cls?: string;
}

/** A line is either a plain string (default color) or an array of segments. */
export type Line = Seg[] | string;

/**
 * A single renderable block of terminal output.
 * - `text`  → preformatted monospace text (whole block one color)
 * - `rich`  → multi-colored lines, each composed of segments
 * - `md`    → markdown rendered via MarkdownRenderer
 * - `component` → a registered rich component (bars, ascii art, composer, etc.)
 */
export type OutputBlock =
  | { type: "text"; content: string; className?: string; glow?: boolean }
  | { type: "rich"; lines: Line[] }
  | { type: "md"; content: string }
  | { type: "component"; key: string; props?: Record<string, unknown> };

/** A single item in the scrollback buffer. */
export type OutputItem =
  | { id: string; kind: "prompt"; text: string; cwd: string }
  | { id: string; kind: "blocks"; blocks: OutputBlock[] };

/** Shell interaction mode. */
export type ShellMode = "shell" | "email" | "matrix" | "boot";

/** Actions exposed to commands via context. */
export interface CommandActions {
  clear: () => void;
  setTheme: (name: string) => void;
  setCwd: (path: string) => void;
  setMode: (mode: ShellMode) => void;
  toggleScanlines: () => void;
  toggleSound: () => void;
  reboot: () => void;
}

/** Context handed to every command at execution time. */
export interface CommandContext {
  args: string[];
  flags: Record<string, string | boolean>;
  raw: string;
  cwd: string;
  actions: CommandActions;
  /** True when the viewport is narrow (< 640px). Commands should emit compact output. */
  compact: boolean;
}

export interface CommandDef {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  complete?: (args: string[], index: number) => string[];
  run: (ctx: CommandContext) => OutputBlock[] | Promise<OutputBlock[] | void> | void;
}

export type ComponentRegistry = Record<string, ComponentType<Record<string, unknown>>>;

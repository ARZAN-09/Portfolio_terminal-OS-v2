"use client";

import { create } from "zustand";
import type { OutputBlock, OutputItem, ShellMode } from "./types";
import { parseCommand } from "./parser";
import { getCommand, suggestionsFor } from "./registry";
import { fs } from "./filesystem";
import { DEFAULT_THEME } from "./themes";
import { profile } from "@/lib/data/portfolio";

let idCounter = 0;
const nextId = () => `o${++idCounter}`;

interface ShellState {
  booted: boolean;
  outputs: OutputItem[];
  commandHistory: string[];
  historyCursor: number;
  draftInput: string;
  cwd: string;
  theme: string;
  scanlines: boolean;
  sound: boolean;
  mode: ShellMode;
  lastError: string | null;

  // boot
  finishBoot: () => void;
  reboot: () => void;

  // output
  pushPrompt: (text: string, cwd: string) => void;
  pushBlocks: (blocks: OutputBlock[]) => void;
  pushText: (content: string, className?: string) => void;
  clear: () => void;

  // input
  setDraft: (v: string) => void;

  // history
  addHistory: (cmd: string) => void;
  historyUp: () => string | null;
  historyDown: () => string | null;
  resetHistoryCursor: () => void;

  // settings
  setTheme: (name: string) => void;
  toggleScanlines: () => void;
  toggleSound: () => void;
  setMode: (mode: ShellMode) => void;

  // execution
  execute: (raw: string) => Promise<void>;
}

export const useShell = create<ShellState>((set, get) => ({
  booted: false,
  outputs: [],
  commandHistory: [],
  historyCursor: -1,
  draftInput: "",
  cwd: "/",
  theme: DEFAULT_THEME,
  scanlines: false,
  sound: false,
  mode: "boot",
  lastError: null,

  finishBoot: () => {
    set({ booted: true, mode: "shell" });
  },
  reboot: () => {
    set({
      booted: false,
      mode: "boot",
      outputs: [],
      commandHistory: [],
      historyCursor: -1,
      draftInput: "",
      cwd: "/",
      lastError: null,
    });
  },

  pushPrompt: (text, cwd) => {
    set((s) => ({ outputs: [...s.outputs, { id: nextId(), kind: "prompt", text, cwd }] }));
  },
  pushBlocks: (blocks) => {
    set((s) => ({ outputs: [...s.outputs, { id: nextId(), kind: "blocks", blocks }] }));
  },
  pushText: (content, className) => {
    get().pushBlocks([{ type: "text", content, className }]);
  },
  clear: () => set({ outputs: [] }),

  setDraft: (v) => set({ draftInput: v }),

  addHistory: (cmd) => {
    if (!cmd.trim()) return;
    set((s) => {
      const hist = [...s.commandHistory, cmd];
      return { commandHistory: hist, historyCursor: hist.length };
    });
  },
  historyUp: () => {
    const { commandHistory, historyCursor } = get();
    if (historyCursor <= 0) return null;
    const next = historyCursor - 1;
    set({ historyCursor: next });
    return commandHistory[next] ?? null;
  },
  historyDown: () => {
    const { commandHistory, historyCursor } = get();
    if (historyCursor >= commandHistory.length - 1) {
      set({ historyCursor: commandHistory.length });
      return "";
    }
    const next = historyCursor + 1;
    set({ historyCursor: next });
    return commandHistory[next] ?? "";
  },
  resetHistoryCursor: () =>
    set((s) => ({ historyCursor: s.commandHistory.length })),

  setTheme: (name) => set({ theme: name }),
  toggleScanlines: () => set((s) => ({ scanlines: !s.scanlines })),
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  setMode: (mode) => set({ mode }),

  execute: async (raw) => {
    const trimmed = raw.trim();
    const cwd = get().cwd;

    // Always echo the prompt line for the entered command.
    const promptText = `${profile.username}@${profile.host}:${cwd === "/" ? "~" : formatCwd(cwd)}$ ${trimmed}`;
    get().pushPrompt(promptText, cwd);

    if (!trimmed) return;

    get().addHistory(trimmed);

    const parsed = parseCommand(trimmed);
    const name = parsed.name;

    const cmd = getCommand(name);
    if (!cmd) {
      const suggestions = suggestionsFor(name);
      let msg = `bash: ${name}: command not found`;
      if (suggestions.length) {
        msg += `\n\nDid you mean: ${suggestions
          .map((s) => `\`${s}\``)
          .join(", ")}?`;
      }
      msg += `\nType \`help\` for a list of available commands.`;
      get().pushText(msg, "text-term-error");
      set({ lastError: msg });
      return;
    }

    const actions = {
      clear: () => get().clear(),
      setTheme: (t: string) => get().setTheme(t),
      setCwd: (p: string) => set({ cwd: p }),
      setMode: (m: ShellMode) => get().setMode(m),
      toggleScanlines: () => get().toggleScanlines(),
      toggleSound: () => get().toggleSound(),
      reboot: () => get().reboot(),
    };

    try {
      const result = await cmd.run({
        args: parsed.args,
        flags: parsed.flags,
        raw: trimmed,
        cwd,
        actions,
        compact: typeof window !== "undefined" && window.innerWidth < 640,
      });
      if (result && (result as OutputBlock[]).length) {
        get().pushBlocks(result as OutputBlock[]);
      }
      set({ lastError: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      get().pushText(`error: ${msg}`, "text-term-error");
      set({ lastError: msg });
    }
  },
}));

function formatCwd(cwd: string): string {
  if (cwd === "/") return "~";
  // /projects -> ~/projects ; only top-level simplified
  const parts = cwd.split("/").filter(Boolean);
  if (parts.length === 1) return "~/" + parts[0];
  return "~/" + parts.join("/");
}

export { fs };

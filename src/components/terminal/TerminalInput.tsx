"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useShell } from "@/lib/shell/store";
import { Prompt } from "./Prompt";
import { Cursor } from "./Cursor";
import { commandNames, getCommand } from "@/lib/shell/registry";
import { fs } from "@/lib/shell/filesystem";
import { playKeystroke } from "@/lib/shell/sound";
import { useHotkeys } from "react-hotkeys-hook";

const FS_COMMANDS = new Set(["ls", "cd", "cat", "tree", "find", "grep", "rm"]);

interface Suggestion {
  ghost: string | null;
  matches: string[];
}

function commonCompletion(prefix: string, matches: string[]): string | null {
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0].slice(prefix.length);
  // common prefix beyond `prefix`
  let common = matches[0];
  for (const m of matches) {
    let i = 0;
    while (i < common.length && i < m.length && common[i] === m[i]) i++;
    common = common.slice(0, i);
  }
  if (common.length <= prefix.length) return null;
  return common.slice(prefix.length);
}

function pathCandidates(last: string, cwd: string): string[] {
  const sep = last.lastIndexOf("/");
  let prefix = "";
  let dir = cwd;
  let base = last;
  if (sep >= 0) {
    prefix = last.slice(0, sep + 1);
    base = last.slice(sep + 1);
    const resolved = fs.cd(cwd, prefix.slice(0, -1) || "/");
    if (!resolved) return [];
    dir = resolved;
  }
  const entries = fs.ls(dir) ?? [];
  return entries
    .map((e) => prefix + e.name + (e.type === "dir" ? "/" : ""))
    .filter((n) => n.startsWith(base));
}

function computeSuggestion(value: string, cwd: string): Suggestion {
  if (!value || value.endsWith(" ")) return { ghost: null, matches: [] };
  const tokens = value.split(/\s+/);
  const last = tokens[tokens.length - 1];

  if (tokens.length === 1) {
    const matches = commandNames().filter((n) => n.startsWith(last) && n !== last);
    return { ghost: commonCompletion(last, matches), matches };
  }

  const cmd = getCommand(tokens[0]);
  let candidates: string[] = [];
  if (cmd?.complete) {
    candidates = cmd.complete(tokens.slice(1), tokens.length - 2) ?? [];
  }
  if (FS_COMMANDS.has(tokens[0])) {
    candidates = [...candidates, ...pathCandidates(last, cwd)];
  }
  candidates = Array.from(new Set(candidates));
  const matches = candidates.filter((c) => c.startsWith(last) && c !== last);
  return { ghost: commonCompletion(last, matches), matches };
}

export function TerminalInput() {
  const value = useShell((s) => s.draftInput);
  const setValue = useShell((s) => s.setDraft);
  const execute = useShell((s) => s.execute);
  const cwd = useShell((s) => s.cwd);
  const sound = useShell((s) => s.sound);
  const addHistory = useShell((s) => s.addHistory);
  const historyUp = useShell((s) => s.historyUp);
  const historyDown = useShell((s) => s.historyDown);
  const resetHistoryCursor = useShell((s) => s.resetHistoryCursor);
  const pushText = useShell((s) => s.pushText);
  const clear = useShell((s) => s.clear);

  const inputRef = useRef<HTMLInputElement>(null);
  const [caret, setCaret] = useState(0);
  const [tabIndex, setTabIndex] = useState(-1);
  const tabMatchesRef = useRef<string[]>([]);

  // keep caret in sync
  useEffect(() => {
    setCaret(value.length);
  }, [value]);

  const suggestion = computeSuggestion(value, cwd);
  const ghost = tabIndex >= 0 ? null : suggestion.ghost;

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
    const len = inputRef.current?.value.length ?? 0;
    inputRef.current?.setSelectionRange(len, len);
  }, []);

  useHotkeys("ctrl+l, meta+l", (e) => {
    e.preventDefault();
    clear();
  });

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const click = () => {
    focusInput();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setTabIndex(-1);
    tabMatchesRef.current = [];
    if (sound) playKeystroke();
  };

  const onSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    setCaret(el.selectionStart ?? 0);
  };

  const acceptSuggestion = (full: string) => {
    setValue(full);
    setTabIndex(-1);
    tabMatchesRef.current = [];
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        el.value = full;
        el.setSelectionRange(full.length, full.length);
        setCaret(full.length);
      }
    });
  };

  const onSubmit = () => {
    const v = value;
    setValue("");
    setTabIndex(-1);
    tabMatchesRef.current = [];
    void execute(v);
  };

  const cancelLine = () => {
    if (value) {
      // echo a ^C line
      pushText(`${value}^C`, "text-term-muted");
      addHistory(value + "^C");
    }
    setValue("");
    setTabIndex(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;

    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
      return;
    }
    if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      // If there's an active text selection, allow native copy.
      const sel = el.selectionStart !== el.selectionEnd;
      if (sel) return;
      e.preventDefault();
      cancelLine();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      handleTab();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = historyUp();
      if (prev != null) {
        setValue(prev);
        setTabIndex(-1);
        requestAnimationFrame(() => {
          el.value = prev;
          el.setSelectionRange(prev.length, prev.length);
          setCaret(prev.length);
        });
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyDown() ?? "";
      setValue(next);
      setTabIndex(-1);
      requestAnimationFrame(() => {
        el.value = next;
        el.setSelectionRange(next.length, next.length);
        setCaret(next.length);
      });
      return;
    }
    if (e.key === "Home" || (e.ctrlKey && e.key === "a")) {
      e.preventDefault();
      el.setSelectionRange(0, 0);
      setCaret(0);
      return;
    }
    if (e.key === "End" || (e.ctrlKey && e.key === "e")) {
      e.preventDefault();
      const len = el.value.length;
      el.setSelectionRange(len, len);
      setCaret(len);
      return;
    }
    if (e.ctrlKey && e.key === "u") {
      e.preventDefault();
      setValue("");
      setCaret(0);
      return;
    }
    if (e.ctrlKey && e.key === "w") {
      e.preventDefault();
      const before = el.value.slice(0, caret);
      const after = el.value.slice(caret);
      const trimmed = before.replace(/\s+\S*\s*$/, "").replace(/\S+\s*$/, "");
      const next = trimmed + after;
      setValue(next);
      requestAnimationFrame(() => {
        el.value = next;
        el.setSelectionRange(trimmed.length, trimmed.length);
        setCaret(trimmed.length);
      });
      return;
    }
    if (sound && e.key.length === 1) playKeystroke();
  };

  const handleTab = () => {
    const { matches } = suggestion;
    // If we already have a cycling list, advance
    if (tabMatchesRef.current.length > 1) {
      const next = (tabIndex + 1) % tabMatchesRef.current.length;
      setTabIndex(next);
      acceptSuggestion(applyMatch(value, tabMatchesRef.current[next]));
      return;
    }
    if (matches.length === 0) return;
    if (matches.length === 1) {
      acceptSuggestion(applyMatch(value, matches[0]));
      return;
    }
    // multiple: first accept common ghost, set up cycling
    tabMatchesRef.current = matches;
    setTabIndex(0);
    acceptSuggestion(applyMatch(value, matches[0]));
    // also print the options so the user sees them
    pushText(matches.join("   "), "text-term-muted");
  };

  // Replace the last token with the chosen match (full last-token string)
  const applyMatch = (val: string, match: string): string => {
    const tokens = val.split(/(\s+)/); // keep spaces
    // find last non-space token index
    let lastIdx = -1;
    for (let i = tokens.length - 1; i >= 0; i--) {
      if (tokens[i].trim() !== "") {
        lastIdx = i;
        break;
      }
    }
    if (lastIdx === -1) return val + match;
    tokens[lastIdx] = match;
    return tokens.join("");
  };

  // Render visible text with custom cursor
  const before = value.slice(0, caret);
  const after = value.slice(caret);
  const atEnd = caret >= value.length;

  return (
    <div className="flex items-baseline gap-1.5 sm:gap-2 cursor-text" onClick={click}>
      <Prompt />
      <div className="relative flex-1 min-w-0">
        {/* visible representation */}
        <div className="whitespace-pre-wrap break-all leading-relaxed" aria-hidden>
          <span className="text-term-fg">{before}</span>
          {atEnd ? (
            <>
              {ghost ? <span className="text-term-muted opacity-60">{ghost}</span> : null}
              <Cursor />
              <span className="text-term-fg">{after}</span>
            </>
          ) : (
            <>
              <Cursor char={value[caret] ?? "\u00A0"} />
              <span className="text-term-fg">{after}</span>
            </>
          )}
        </div>
        {/* hidden real input capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          className="term-input absolute inset-0 w-full h-full"
          value={value}
          onChange={onChange}
          onSelect={onSelect}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label="Terminal command input"
          enterKeyHint="send"
        />
      </div>
    </div>
  );
}

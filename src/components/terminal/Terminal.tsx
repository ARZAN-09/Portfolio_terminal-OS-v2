"use client";

import { useEffect, useRef } from "react";
import { useShell } from "@/lib/shell/store";
import "@/lib/commands"; // register all commands (side-effect import)
import { OutputRenderer } from "./OutputRenderer";
import { TerminalInput } from "./TerminalInput";
import { BootSequence } from "./BootSequence";
import { EmailComposer } from "./EmailComposer";
import { MatrixRain } from "./MatrixRain";
import { THEMES } from "@/lib/shell/themes";
import { cn } from "@/lib/utils";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function Terminal() {
  const mode = useShell((s) => s.mode);
  const theme = useShell((s) => s.theme);
  const scanlines = useShell((s) => s.scanlines);
  const sound = useShell((s) => s.sound);
  const outputs = useShell((s) => s.outputs);
  const pushText = useShell((s) => s.pushText);

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  // Konami code detection
  useEffect(() => {
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buf.push(key);
      if (buf.length > KONAMI.length) buf = buf.slice(-KONAMI.length);
      if (buf.length === KONAMI.length && buf.every((k, i) => k === KONAMI[i].toLowerCase())) {
        pushText(
          "🎮 KONAMI CODE! +30 lives. The Matrix respects you.\n(try `matrix`, `sudo hire arzan`, `fortune`, `coffee`)",
          "text-term-yellow"
        );
        buf = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pushText]);

  // Track whether the user is parked at the bottom of the scrollback
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  // Auto-scroll to bottom on new output (only if user is at the bottom)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (stickToBottom.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [outputs]);

  // Ensure the input stays in view when the mobile keyboard pops up
  useEffect(() => {
    const onResize = () => {
      if (stickToBottom.current && scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (mode === "boot") {
    return (
      <div
        data-theme={theme}
        className={cn("h-dvh w-screen overflow-hidden", scanlines && "crt-scanlines crt-flicker")}
      >
        <BootSequence />
      </div>
    );
  }

  if (mode === "email") {
    return (
      <div
        data-theme={theme}
        className={cn("h-dvh w-screen overflow-hidden", scanlines && "crt-scanlines crt-flicker")}
      >
        <EmailComposer />
      </div>
    );
  }

  const themeName = THEMES.find((t) => t.id === theme)?.name ?? theme;

  return (
    <div
      data-theme={theme}
      className={cn(
        "h-dvh w-screen flex flex-col overflow-hidden",
        scanlines && "crt-scanlines crt-flicker"
      )}
    >
      {/* Scrollable output history */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onClick={() => {
          const input = document.querySelector<HTMLInputElement>(
            'input[aria-label="Terminal command input"]'
          );
          input?.focus();
        }}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden term-scroll px-3 sm:px-5 pt-3 sm:pt-5 pb-2"
      >
        <OutputRenderer items={outputs} />
      </div>

      {/* Sticky bottom: status line + input prompt */}
      <div className="shrink-0 border-t border-term-dim bg-term-bg/95 backdrop-blur-sm">
        <div className="px-3 sm:px-5 pt-1.5 pb-2">
          <TerminalInput />
        </div>
        <div className="px-3 sm:px-5 py-1 border-t border-term-dim flex items-center justify-between text-[10px] sm:text-xs text-term-muted select-none gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="truncate">
              <span className="text-term-muted">theme:</span>{" "}
              <span className="text-term-cyan">{themeName}</span>
            </span>
            <span className="hidden xs:inline sm:inline shrink-0">
              <span className="text-term-muted">scan:</span>{" "}
              <span className={scanlines ? "text-term-accent" : "text-term-muted"}>
                {scanlines ? "on" : "off"}
              </span>
            </span>
            <span className="hidden xs:inline sm:inline shrink-0">
              <span className="text-term-muted">snd:</span>{" "}
              <span className={sound ? "text-term-accent" : "text-term-muted"}>
                {sound ? "on" : "off"}
              </span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <span>
              <span className="text-term-yellow">↑/↓</span> history
            </span>
            <span>
              <span className="text-term-yellow">Tab</span> complete
            </span>
            <span>
              <span className="text-term-yellow">Ctrl+L</span> clear
            </span>
          </div>
        </div>
      </div>

      {mode === "matrix" && <MatrixRain />}
    </div>
  );
}

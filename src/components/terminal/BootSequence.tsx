"use client";

import { useEffect, useRef, useState } from "react";
import { useShell } from "@/lib/shell/store";
import { playKeystroke } from "@/lib/shell/sound";
import { banner } from "@/lib/data/portfolio";
import { motion } from "framer-motion";

const BOOT_LINES = [
  "Booting PortfolioOS...",
  "",
  "Loading modules...    [████████] OK",
  "Loading projects...   [████████] OK",
  "Loading skills...     [████████] OK",
  "Loading resume...     [████████] OK",
  "Loading shell...      [████████] OK",
  "",
  "Welcome.",
  "",
  'Type "help" to begin.',
];

export function BootSequence() {
  const finishBoot = useShell((s) => s.finishBoot);
  const pushBlocks = useShell((s) => s.pushBlocks);
  const sound = useShell((s) => s.sound);
  const [typed, setTyped] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) return;
    if (lineIdx >= BOOT_LINES.length) {
      const t = setTimeout(() => {
        // push the welcome banner into history, then finish boot
        pushBlocks([
          { type: "text", content: banner, className: "text-term-accent", glow: true },
          { type: "text", content: "", className: "text-term-fg" },
          {
            type: "rich",
            lines: [
              [
                { text: "Welcome to ", cls: "text-term-fg" },
                { text: "PortfolioOS", cls: "text-term-cyan text-glow" },
                { text: " — Arzan's interactive portfolio.", cls: "text-term-fg" },
              ],
              [
                { text: "Type ", cls: "text-term-muted" },
                { text: "help", cls: "text-term-accent" },
                { text: " to list commands, or try ", cls: "text-term-muted" },
                { text: "neofetch", cls: "text-term-accent" },
                { text: ", ", cls: "text-term-muted" },
                { text: "projects", cls: "text-term-accent" },
                { text: ", ", cls: "text-term-muted" },
                { text: "sudo hire arzan", cls: "text-term-yellow" },
                { text: ".", cls: "text-term-muted" },
              ],
              "",
            ],
          },
        ]);
        setDone(true);
        setTimeout(() => finishBoot(), 250);
      }, 500);
      return () => clearTimeout(t);
    }

    const line = BOOT_LINES[lineIdx];
    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx++;
      const partial = line.slice(0, charIdx);
      setTyped((prev) => {
        const lines = prev.split("\n");
        lines[lineIdx] = partial;
        return lines.join("\n");
      });
      if (sound && charIdx % 2 === 0) playKeystroke();
      if (charIdx >= line.length) {
        clearInterval(interval);
        setTyped((prev) => prev + "\n");
        setTimeout(() => setLineIdx((i) => i + 1), line === "" ? 60 : 90);
      }
    }, line === "" ? 10 : 14);

    return () => clearInterval(interval);
  }, [lineIdx, done, finishBoot, pushBlocks, sound]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [typed]);

  return (
    <motion.div
      ref={scrollRef}
      className="h-full overflow-y-auto term-scroll p-3 sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <pre className="whitespace-pre-wrap break-all text-term-fg text-xs sm:text-sm leading-relaxed">
        {typed}
        <span className="cursor-blink inline-block bg-term-accent text-term-bg w-[0.6em] min-w-[8px]">
          {"\u00A0"}
        </span>
      </pre>
    </motion.div>
  );
}

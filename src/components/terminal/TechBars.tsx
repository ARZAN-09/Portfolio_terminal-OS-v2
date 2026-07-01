"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface TechItem {
  name: string;
  level: number;
  category: string;
}

export function TechBars({ items }: { items: TechItem[] }) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const byCat: Record<string, TechItem[]> = {};
  for (const it of items) {
    (byCat[it.category] ??= []).push(it);
  }

  // Responsive bar width: smaller on mobile so the whole row fits
  const barWidth = isMobile ? 16 : 28; // characters
  const nameWidth = isMobile ? "w-16" : "w-28";

  return (
    <div className="py-1">
      {Object.entries(byCat).map(([cat, list]) => (
        <div key={cat} className="mb-3">
          <div className="text-term-cyan mb-1">{cat}</div>
          {list.map((it, i) => (
            <div key={it.name} className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-xs" style={{ fontSize: isMobile ? "0.75rem" : undefined }}>
              <span className={`text-term-fg ${nameWidth} shrink-0 truncate`}>{it.name}</span>
              <span className="text-term-dim shrink-0">[</span>
              <span className="relative inline-flex overflow-hidden" style={{ minWidth: `${barWidth}ch` }}>
                <span className="text-term-accent">
                  {mounted ? "█".repeat(Math.round((it.level / 100) * barWidth)) : ""}
                </span>
                <span className="text-term-dim">
                  {"░".repeat(barWidth - Math.round((it.level / 100) * barWidth))}
                </span>
              </span>
              <span className="text-term-dim shrink-0">]</span>
              <motion.span
                className="text-term-yellow shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                {String(it.level).padStart(3, " ")}%
              </motion.span>
            </div>
          ))}
        </div>
      ))}
      <div className="text-term-muted text-xs mt-1">
        {"// proficiency is self-assessed & evolving — run `skills` for the flat list"}
      </div>
    </div>
  );
}

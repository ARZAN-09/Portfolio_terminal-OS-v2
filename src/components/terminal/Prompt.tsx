"use client";

import { profile } from "@/lib/data/portfolio";
import { useShell } from "@/lib/shell/store";

export function Prompt() {
  const cwd = useShell((s) => s.cwd);
  const path = cwd === "/" ? "~" : "~/" + cwd.split("/").filter(Boolean).join("/");
  return (
    <span className="whitespace-nowrap select-none shrink-0">
      <span className="text-term-accent text-glow">{profile.username}</span>
      <span className="text-term-muted">@</span>
      <span className="text-term-cyan">{profile.host}</span>
      <span className="text-term-muted">:</span>
      <span className="text-term-yellow">{path}</span>
      <span className="text-term-muted">&nbsp;$</span>
    </span>
  );
}

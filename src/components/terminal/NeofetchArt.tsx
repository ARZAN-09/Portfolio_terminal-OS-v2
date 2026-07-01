"use client";

import { profile, projects, contacts } from "@/lib/data/portfolio";
import { useIsMobile } from "@/hooks/use-mobile";

const ART = String.raw`
    _         ______
   / \   _ __|__  /_ __
  / _ \ | '__| / /|_  /
 / ___ \| |   / /_ / /
/_/   \_\_|  /____/___|
`;

export function NeofetchArt() {
  const isMobile = useIsMobile();
  const rows: [string, string][] = [
    ["OS", profile.os],
    ["Host", profile.name],
    ["Shell", profile.shell],
    ["Role", profile.role],
    ["Education", "Diploma CSE"],
    ["Focus", profile.focus.join(", ")],
    ["Projects", String(projects.length)],
    ["GitHub", `@${profile.githubUsername}`],
    ["Location", profile.location],
    ["Uptime", "since you arrived"],
  ];
  const colors = [
    "text-term-accent",
    "text-term-cyan",
    "text-term-yellow",
  ];

  const labelWidth = isMobile ? "w-20" : "w-28";
  const dividerLen = isMobile ? 20 : 28;

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 py-1">
      <pre className="text-term-accent text-glow text-[0.6rem] sm:text-xs leading-tight select-none overflow-x-auto">
        {ART}
      </pre>
      <div className="flex flex-col min-w-0">
        <div className="text-term-accent text-glow mb-1 break-all">
          {profile.username}@{profile.host}
        </div>
        <div className="text-term-muted mb-1">{"─".repeat(dividerLen)}</div>
        {rows.map(([k, v], i) => (
          <div key={k} className="flex gap-2 text-sm sm:text-xs">
            <span className={`${colors[i % colors.length]} ${labelWidth} shrink-0`}>{k}</span>
            <span className="text-term-fg break-all min-w-0">{v}</span>
          </div>
        ))}
        <div className="mt-2 flex gap-1">
          {["bg-term-accent", "bg-term-cyan", "bg-term-yellow", "bg-term-error", "bg-term-muted"].map(
            (c, i) => (
              <span key={i} className={`inline-block w-3 h-3 sm:w-4 sm:h-4 ${c}`} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

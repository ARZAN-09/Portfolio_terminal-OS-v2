"use client";

import type { Line, Seg } from "@/lib/shell/types";

/** Render a single line (string | Seg[]) into spans preserving whitespace. */
export function RichLine({ line }: { line: Line }) {
  if (typeof line === "string") {
    return <span className="whitespace-pre-wrap break-all">{line || "\u00A0"}</span>;
  }
  return (
    <span className="whitespace-pre-wrap break-all">
      {line.length === 0 ? "\u00A0" : line.map((s, i) => <SegView key={i} seg={s} />)}
    </span>
  );
}

function SegView({ seg }: { seg: Seg }) {
  const cls = seg.cls ?? "";
  return <span className={cls}>{seg.text}</span>;
}

import type { Line, OutputBlock, Seg } from "@/lib/shell/types";

export const t = {
  text: (content: string, className?: string): OutputBlock => ({
    type: "text",
    content,
    className,
  }),
  glow: (content: string, className = "text-term-accent"): OutputBlock => ({
    type: "text",
    content,
    className,
    glow: true,
  }),
  rich: (lines: Line[]): OutputBlock => ({ type: "rich", lines }),
  md: (content: string): OutputBlock => ({ type: "md", content }),
  comp: (key: string, props?: Record<string, unknown>): OutputBlock => ({
    type: "component",
    key,
    props,
  }),
};

/* ---- colored segment helpers (used to build `rich` lines) ---- */
type SegLike = string | Seg;
const toSeg = (s: SegLike, cls?: string): Seg =>
  typeof s === "string" ? { text: s, cls } : s;

export const c = (text: SegLike): Seg => toSeg(text, "text-term-accent"); // accent green
export const cy = (text: SegLike): Seg => toSeg(text, "text-term-cyan"); // cyan
export const y = (text: SegLike): Seg => toSeg(text, "text-term-yellow"); // yellow
export const mu = (text: SegLike): Seg => toSeg(text, "text-term-muted"); // muted
export const er = (text: SegLike): Seg => toSeg(text, "text-term-error"); // error
export const fg = (text: SegLike): Seg => toSeg(text, "text-term-fg"); // default
export const pl = (text: SegLike): Seg => toSeg(text, "text-term-accent text-glow"); // prompt-ish

/** Build a line from a mix of strings and segments. */
export const L = (...segs: SegLike[]): Seg[] => segs.map((s) => toSeg(s));

/** Pad a value to a width (works for segments by measuring text). */
export function pad(seg: Seg, width: number): Seg {
  const len = [...seg.text].length;
  const extra = Math.max(0, width - len);
  return { ...seg, text: seg.text + " ".repeat(extra) };
}

/**
 * Compact-aware pad: when `compact` is true, returns the segment with no
 * trailing padding so columns don't waste horizontal space on mobile.
 * The `gap` string (default "  ") is inserted after the segment to separate
 * it from the next column.
 */
export function padC(seg: Seg, width: number, compact: boolean, gap = "  "): Seg {
  if (compact) {
    return { ...seg, text: seg.text + gap };
  }
  return pad(seg, width);
}

/** Two-column key/value as a single rich line. */
export function kvLine(label: string, value: Line, labelWidth = 16): Line {
  const labelSeg = pad(c(label), labelWidth);
  if (typeof value === "string") return [labelSeg, fg(value)];
  return [labelSeg, ...value];
}

export const SP = "  ";

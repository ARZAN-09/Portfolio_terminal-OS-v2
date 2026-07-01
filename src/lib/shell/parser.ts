/**
 * Minimal POSIX-ish command parser.
 * Supports quoted strings, flags (-x / --long), and flag values (--key=value).
 */
export interface ParsedCommand {
  name: string;
  args: string[];
  flags: Record<string, string | boolean>;
  raw: string;
}

export function parseCommand(input: string): ParsedCommand {
  const raw = input;
  const tokens = tokenize(input);
  const name = tokens.shift() ?? "";
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.startsWith("--")) {
      const eq = tok.indexOf("=");
      if (eq > -1) {
        flags[tok.slice(2, eq)] = tok.slice(eq + 1);
      } else {
        flags[tok.slice(2)] = true;
      }
    } else if (tok.startsWith("-") && tok.length > 1 && !/^-\d/.test(tok)) {
      // short flags: -abc => a, b, c
      for (const ch of tok.slice(1)) flags[ch] = true;
    } else {
      args.push(tok);
    }
    i++;
  }

  return { name, args, flags, raw };
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let buf = "";
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        buf += ch;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === "\\" && i + 1 < input.length) {
      buf += input[++i];
      continue;
    }
    if (/\s/.test(ch)) {
      if (buf) {
        tokens.push(buf);
        buf = "";
      }
      continue;
    }
    buf += ch;
  }
  if (buf) tokens.push(buf);
  return tokens;
}

/** Did-you-mean: Levenshtein-based suggestion. */
export function suggest(input: string, candidates: string[], max = 2): string[] {
  const out: { word: string; dist: number }[] = [];
  for (const c of candidates) {
    const d = levenshtein(input.toLowerCase(), c.toLowerCase());
    if (d <= max) out.push({ word: c, dist: d });
  }
  out.sort((a, b) => a.dist - b.dist);
  return out.slice(0, 3).map((o) => o.word);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

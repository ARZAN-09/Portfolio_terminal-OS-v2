import { register } from "@/lib/shell/registry";
import { t, c, cy, y, mu, fg, er, L } from "./_helpers";
import { useShell } from "@/lib/shell/store";
import { profile } from "@/lib/data/portfolio";

/* ---------------- sudo ---------------- */
register({
  name: "sudo",
  description: "[easter egg] Execute a command with elevated privileges…",
  usage: "sudo <command>",
  run: ({ args }) => {
    const sub = args.join(" ");
    if (sub.startsWith("hire") && sub.includes("arzan")) {
      return [
        t.rich([
          L(c("[sudo] password for recruiter: *******")),
          L(y("Permission granted.")),
          L(""),
          L(fg(`   ▸ Initiating hire protocol for ${profile.name}…`)),
          L(cy("   ▸ Checking credentials… OK")),
          L(cy("   ▸ Verifying projects… OK")),
          L(cy("   ▸ Assessing vibe… unmatched")),
          L(c("   ▸ Offer letter dispatched to "), fg(profile.email)),
          L(""),
          L(mu("// (this is a fantasy terminal — but the interest is real)")),
        ]),
      ];
    }
    return [
      t.rich([
        L(er(`arzan is not in the sudoers file. This incident will be reported.`)),
        L(mu("// nice try though 👀")),
      ]),
    ];
  },
});

/* ---------------- matrix ---------------- */
register({
  name: "matrix",
  description: "[easter egg] Wake up, Neo…",
  run: ({ actions }) => {
    actions.setMode("matrix");
    return [t.rich([L(c("Wake up, Neo…"), mu("  (press any key to exit the Matrix)"))])];
  },
});

/* ---------------- coffee ---------------- */
register({
  name: "coffee",
  description: "[easter egg] Brew a fresh cup.",
  run: () => [
    t.rich([
      L(y("      ( (    )")),
      L(y("       ) )  (")),
      L(y("      ( (    )")),
      L(y("    _______)_")),
      L(y("   |'---------|")),
      L(y("   |  COFFEE  |")),
      L(y("   |'---------'")),
      L(""),
      L(c("☕ Coffee acquired."), mu("  Bugs now optional. Focus +10.")),
    ]),
  ],
});

/* ---------------- fortune ---------------- */
const FORTUNES = [
  "The best code is the code you didn't have to write.",
  "A terminal a day keeps the GUI away.",
  "Commit early, commit often, and never commit directly to main on a Friday.",
  "There are 10 types of people: those who read binary and those who don't.",
  "If it works, don't touch it. If it doesn't, blame the cache.",
  "The root of all bugs is assumptions. The root of all features is curiosity.",
  "rm -rf / your doubts. Ship the thing.",
  "Beautiful UI is just hidden complexity with better taste.",
  "You don't truly understand recursion until you debug recursion.",
  "A portfolio is a conversation. Thanks for talking.",
];
register({
  name: "fortune",
  description: "[easter egg] A random wisdom cookie.",
  run: () => {
    const f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    return [t.rich([L(mu('┌─ fortune ─────────────────────────────────┐')), L(mu("│ "), fg(` "${f}"`)), L(mu("└────────────────────────────────────────────┘"))])];
  },
});

/* ---------------- hello ---------------- */
register({
  name: "hello",
  description: "[easter egg] Say hello to the world.",
  run: () => [
    t.rich([
      L(c("Hello, world!"), mu("  — and hello, you.")),
      L(""),
      L(fg("  You've found the hello easter egg. That already makes you")),
      L(fg("  my favorite kind of visitor — the curious kind.")),
      L(""),
      L(mu(`  — ${profile.name}`)),
    ]),
  ],
});

/* ---------------- rm ---------------- */
register({
  name: "rm",
  description: "[easter egg] Remove files… (don't).",
  usage: "rm [flags] <path>",
  run: ({ args, flags }) => {
    const recursive = flags.r || flags.rf || flags.f;
    const target = args.join(" ") || ".";
    if (recursive && (target === "/" || target === "/*" || target === "~")) {
      return [
        t.rich([
          L(er("rm: it is dangerous to operate recursively on '/'")),
          L(er("rm: use --no-preserve-root to override this safeguard")),
          L(""),
          L(mu("Arzan blocked the command. This portfolio is read-only —")),
          L(mu("it exists to be explored, not deleted. 🙂")),
        ]),
      ];
    }
    return [t.rich([L(mu(`rm: cannot remove '${target}': filesystem is read-only`))])];
  },
});

/* ---------------- yes ---------------- */
register({
  name: "yes",
  description: "[easter egg] Repeat 'y' until interrupted.",
  run: () => {
    const lines = Array.from({ length: 18 }, () => "y").join("\n");
    return [
      t.text(lines, "text-term-yellow"),
      ...[
        {
          type: "rich" as const,
          lines: [
            L(mu("// (yes is well-behaved here — it stops before it gets annoying)")),
          ],
        },
      ],
    ];
  },
});

/* ---------------- make ---------------- */
register({
  name: "make",
  description: "[easter egg] GNU make, but make it personal.",
  usage: "make <target>",
  run: ({ args }) => {
    const target = args.join(" ") || "";
    if (target === "me rich") {
      return [
        t.rich([
          L(er("make: *** No rule to make target 'me rich'.  Stop.")),
          L(""),
          L(mu("However, here's the closest thing:"), fg("")),
          L(c("  - learn a skill")),
          L(c("  - build something")),
          L(c("  - ship it")),
          L(c("  - repeat")),
          L(mu("// compounding > lottery tickets.")),
        ]),
      ];
    }
    if (target === "me a sandwich") {
      return [t.rich([L(er("make: *** No rule to make target 'me a sandwich'.  Stop.")), L(mu("// sudo make me a sandwich"))])];
    }
    return [t.rich([L(er(`make: *** No rule to make target '${target}'.  Stop.`))])];
  },
});

/* ---------------- hack ---------------- */
register({
  name: "hack",
  description: "[easter egg] Hack the planet (safely).",
  usage: "hack <target>",
  run: ({ args }) => {
    const target = args.join(" ") || "the planet";
    return [
      t.rich([
        L(c(`[+] Target acquired: ${target}`)),
        L(cy("[+] Bypassing firewall…")),
        L(cy("[+] Spoofing MAC address…")),
        L(y("[+] Decrypting RSA-4096…")),
        L(y("[+] Deploying payload…")),
        L(er("[!] ACCESS DENIED")),
        L(""),
        L(mu("Just kidding. I build secure systems — I don't break into them")),
        L(mu("(unless you're paying me to pentest, in which case: let's talk).")),
      ]),
    ];
  },
});

/* ---------------- konami ---------------- */
register({
  name: "konami",
  description: "[easter egg] ↑ ↑ ↓ ↓ ← → ← → B A",
  run: () => {
    useShell.getState().pushText(
      "Konami code detected. 30 lives granted. 🎮\n(now go explore — try `matrix`, `sudo hire arzan`, or `fortune`)",
      "text-term-yellow"
    );
    return [];
  },
});

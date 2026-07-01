"use client";

import { useEffect, useRef, useState } from "react";
import { useShell } from "@/lib/shell/store";
import { profile } from "@/lib/data/portfolio";
import { Cursor } from "./Cursor";

export function EmailComposer() {
  const setMode = useShell((s) => s.setMode);
  const pushBlocks = useShell((s) => s.pushBlocks);
  const [to, setTo] = useState(profile.email);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [focusIdx, setFocusIdx] = useState(0); // 0=to,1=subject,2=message
  const toRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    toRef.current?.focus();
    toRef.current?.select();
  }, []);

  const cancel = () => {
    pushBlocks([
      {
        type: "text",
        content: "✉  email composer closed — nothing sent.",
        className: "text-term-muted",
      },
    ]);
    setMode("shell");
  };

  const send = () => {
    if (!to || !subject) {
      pushBlocks([
        {
          type: "text",
          content: "email: 'To' and 'Subject' are required. Composer kept open.",
          className: "text-term-error",
        },
      ]);
      return;
    }
    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    if (typeof window !== "undefined") window.location.href = url;
    pushBlocks([
      {
        type: "rich",
        lines: [
          [{ text: "✉  Opening your mail client…", cls: "text-term-accent" }],
          [
            { text: "   to: ", cls: "text-term-muted" },
            { text: to, cls: "text-term-fg" },
          ],
          [
            { text: "   subject: ", cls: "text-term-muted" },
            { text: subject, cls: "text-term-fg" },
          ],
          [
            { text: "// if nothing opened, email me at ", cls: "text-term-muted" },
            { text: profile.email, cls: "text-term-cyan" },
          ],
        ],
      },
    ]);
    setMode("shell");
  };

  useHotkeysSafe(cancel, send);

  const field = (idx: number) =>
    focusIdx === idx ? <Cursor /> : null;

  return (
    <div className="h-full overflow-y-auto term-scroll p-3 sm:p-5" onClick={() => {
      [toRef, subjectRef, msgRef][focusIdx]?.current?.focus();
    }}>
      <div className="text-term-accent text-glow mb-3 text-sm sm:text-base">compose — terminal email</div>
      <div className="space-y-2 text-xs sm:text-sm">
        <label className="flex items-baseline gap-2">
          <span className="text-term-cyan w-14 sm:w-20 shrink-0">To:</span>
          <input
            ref={toRef}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onFocus={() => setFocusIdx(0)}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-term-fg caret-term-accent"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
          />
          {field(0)}
        </label>
        <label className="flex items-baseline gap-2">
          <span className="text-term-cyan w-14 sm:w-20 shrink-0">Subject:</span>
          <input
            ref={subjectRef}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onFocus={() => setFocusIdx(1)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                msgRef.current?.focus();
              }
            }}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-term-fg caret-term-accent"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
          />
          {field(1)}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-term-cyan">Message:</span>
          <textarea
            ref={msgRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setFocusIdx(2)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                toRef.current?.focus();
              }
            }}
            rows={6}
            className="w-full bg-term-soft border border-term-dim p-2 outline-none text-term-fg caret-term-accent resize-none term-scroll text-xs sm:text-sm"
            spellCheck={false}
          />
        </label>
        <div className="text-term-muted text-[10px] sm:text-xs pt-1">
          <span className="text-term-yellow">Ctrl+Enter</span> send ·{" "}
          <span className="text-term-yellow">Esc</span> cancel ·{" "}
          <span className="text-term-yellow">Tab</span> next field
        </div>
      </div>
    </div>
  );
}

/** Native window keydown listener — robust regardless of focus path. */
function useHotkeysSafe(cancel: () => void, send: () => void) {
  const cancelRef = useRef(cancel);
  const sendRef = useRef(send);

  useEffect(() => {
    cancelRef.current = cancel;
    sendRef.current = send;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelRef.current();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        sendRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

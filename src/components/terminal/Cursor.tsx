"use client";

export function Cursor({ char = "\u00A0" }: { char?: string }) {
  return (
    <span className="cursor-blink inline-block bg-term-accent text-term-bg align-middle w-[0.6em] min-w-[8px]">
      {char}
    </span>
  );
}

"use client";

import type { OutputBlock, OutputItem } from "@/lib/shell/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { RichLine } from "./RichLine";
import { componentRegistry } from "./componentRegistry";
import { profile } from "@/lib/data/portfolio";

export function OutputRenderer({ items }: { items: OutputItem[] }) {
  return (
    <div className="text-xs sm:text-sm leading-relaxed">
      {items.map((item) =>
        item.kind === "prompt" ? (
          <PromptLine key={item.id} text={item.text} />
        ) : (
          <Blocks key={item.id} blocks={item.blocks} />
        )
      )}
    </div>
  );
}

function PromptLine({ text }: { text: string }) {
  // colorize: arzan@portfolio:~$ ...
  const m = text.match(/^([a-z_]+)@([a-z_]+):([^$]+)\$(.*)$/);
  if (!m) {
    return <div className="term-fade whitespace-pre-wrap break-all">{text}</div>;
  }
  const [, user, host, path, rest] = m;
  return (
    <div className="term-fade whitespace-pre-wrap break-all">
      <span className="text-term-accent text-glow">{user}</span>
      <span className="text-term-muted">@</span>
      <span className="text-term-cyan">{host}</span>
      <span className="text-term-muted">:</span>
      <span className="text-term-yellow">{path}</span>
      <span className="text-term-muted">$</span>
      <span className="text-term-fg">{rest}</span>
    </div>
  );
}

function Blocks({ blocks }: { blocks: OutputBlock[] }) {
  return (
    <div className="term-fade">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: OutputBlock }) {
  switch (block.type) {
    case "text":
      return (
        <pre
          className={`whitespace-pre-wrap break-all ${block.className ?? "text-term-fg"} ${
            block.glow ? "text-glow" : ""
          }`}
        >
          {block.content}
        </pre>
      );
    case "rich":
      return (
        <div>
          {block.lines.map((line, i) => (
            <div key={i}>
              <RichLine line={line} />
            </div>
          ))}
        </div>
      );
    case "md":
      return <MarkdownRenderer content={block.content} />;
    case "component": {
      const Cmp = componentRegistry[block.key];
      if (!Cmp) return <pre className="text-term-error">[unknown component: {block.key}]</pre>;
      return <Cmp {...(block.props ?? {})} />;
    }
  }
}

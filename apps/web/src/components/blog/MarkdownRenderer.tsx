"use client";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

interface MarkdownProps {
  content: string;
  className?: string;
  compact?: boolean; // for comment preview
}

// ─── Inline parser ─────────────────────────────────────────────────────────

function parseInline(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < text.length) {
    // Bold + italic: ***text***
    if (text.slice(i, i + 3) === "***") {
      const end = text.indexOf("***", i + 3);
      if (end !== -1) {
        result.push(<strong key={i}><em>{text.slice(i + 3, end)}</em></strong>);
        i = end + 3; continue;
      }
    }
    // Bold: **text**
    if (text.slice(i, i + 2) === "**") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        result.push(<strong key={i} className="font-bold text-foreground">{text.slice(i + 2, end)}</strong>);
        i = end + 2; continue;
      }
    }
    // Italic: *text* or _text_
    if (text[i] === "*" || (text[i] === "_" && (i === 0 || text[i - 1] === " "))) {
      const ch  = text[i];
      const end = text.indexOf(ch, i + 1);
      if (end !== -1 && text[end + 1] !== ch) {
        result.push(<em key={i}>{text.slice(i + 1, end)}</em>);
        i = end + 1; continue;
      }
    }
    // Code: `code`
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        result.push(
          <code key={i} className="rounded-md bg-muted/50 border border-border/40 px-1.5 py-0.5 text-[0.85em] font-mono text-primary/90">
            {text.slice(i + 1, end)}
          </code>
        );
        i = end + 1; continue;
      }
    }
    // Link: [text](url)
    if (text[i] === "[") {
      const closeBracket = text.indexOf("]", i);
      if (closeBracket !== -1 && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen !== -1) {
          const linkText = text.slice(i + 1, closeBracket);
          const linkUrl  = text.slice(closeBracket + 2, closeParen);
          result.push(
            <a key={i} href={linkUrl} target="_blank" rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
              {linkText}
            </a>
          );
          i = closeParen + 1; continue;
        }
      }
    }
    // Strikethrough: ~~text~~
    if (text.slice(i, i + 2) === "~~") {
      const end = text.indexOf("~~", i + 2);
      if (end !== -1) {
        result.push(<del key={i} className="opacity-60">{text.slice(i + 2, end)}</del>);
        i = end + 2; continue;
      }
    }
    // Normal char
    const last = result[result.length - 1];
    if (typeof last === "string") {
      result[result.length - 1] = last + text[i];
    } else {
      result.push(text[i]);
    }
    i++;
  }
  return result;
}

// ─── Block parser ──────────────────────────────────────────────────────────

function parseBlocks(content: string): React.ReactNode[] {
  const lines   = content.split("\n");
  const nodes:  React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (line.trim() === "") { i++; continue; }

    // Heading # ## ### #### ##### ######
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text  = headingMatch[2];
      const cls = [
        "text-2xl sm:text-3xl font-black text-foreground mt-10 mb-4 leading-tight",
        "text-xl sm:text-2xl font-black text-foreground mt-8 mb-3",
        "text-lg sm:text-xl font-bold text-foreground mt-6 mb-2",
        "text-base font-bold text-foreground mt-5 mb-2",
        "text-sm font-bold text-foreground/80 mt-4 mb-1",
        "text-xs font-bold text-foreground/60 mt-3 mb-1",
      ][level - 1];
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      nodes.push(<Tag key={i} className={cls}>{parseInline(text)}</Tag>);
      i++; continue;
    }

    // Horizontal rule ---
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      nodes.push(<hr key={i} className="my-8 border-border/40" />);
      i++; continue;
    }

    // Block quote > 
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <blockquote key={`bq-${i}`} className="my-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground/80 bg-primary/5 py-3 rounded-r-xl">
          {quoteLines.map((l, j) => <p key={j} className="leading-relaxed">{parseInline(l)}</p>)}
        </blockquote>
      );
      continue;
    }

    // Code block ```
    if (line.startsWith("```")) {
      const lang      = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push(
        <div key={`code-${i}`} className="my-5 overflow-hidden rounded-xl border border-border/50 bg-black/30">
          {lang && (
            <div className="flex items-center gap-2 border-b border-border/30 px-4 py-2 bg-black/20">
              <span className="text-[10px] font-mono font-bold text-muted-foreground/50 uppercase tracking-widest">{lang}</span>
            </div>
          )}
          <pre className="overflow-x-auto p-4 text-sm text-foreground/80 font-mono leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Unordered list - * +
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-4 ml-5 space-y-1.5 list-none">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-muted-foreground/80 leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list 1.
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      let   counter = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="my-4 ml-5 space-y-1.5 list-none">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-muted-foreground/80 leading-relaxed">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-black text-primary/80">{j + 1}</span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Image ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      nodes.push(
        <figure key={i} className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgMatch[2]} alt={imgMatch[1]}
            className="w-full rounded-xl border border-border/30 object-cover" />
          {imgMatch[1] && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground/50 italic">{imgMatch[1]}</figcaption>
          )}
        </figure>
      );
      i++; continue;
    }

    // Paragraph — gabungkan baris berurutan
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("```") &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim()) &&
      !lines[i].match(/^!\[/)
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    if (paraLines.length > 0) {
      nodes.push(
        <p key={`p-${i}`} className="my-4 leading-relaxed text-muted-foreground/85">
          {paraLines.map((l, j) => (
            <span key={j}>
              {parseInline(l)}
              {j < paraLines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    }
  }

  return nodes;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function MarkdownRenderer({ content, className, compact }: MarkdownProps) {
  if (!content?.trim()) {
    return <p className="italic text-muted-foreground/40">Konten kosong.</p>;
  }

  const nodes = parseBlocks(content);

  return (
    <div className={cn(
      "text-sm",
      compact ? "space-y-1" : "space-y-0",
      className
    )}>
      {nodes}
    </div>
  );
}

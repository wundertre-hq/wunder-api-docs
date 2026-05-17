import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language = "bash",
  className,
  filename,
}: {
  code: string;
  language?: string;
  className?: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className={cn("group relative my-4 overflow-hidden rounded-lg border border-border bg-[oklch(0.14_0.02_240)]", className)}>
      <div className="flex items-center justify-between border-b border-border bg-[oklch(0.18_0.02_240)] px-3 py-1.5">
        <span className="text-xs text-muted-foreground font-mono">{filename ?? language}</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          background: "transparent",
          padding: "1rem",
          fontSize: "0.825rem",
          lineHeight: 1.6,
        }}
        codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}

import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

const styles: Record<Method, string> = {
  GET: "bg-[oklch(0.77_0.14_215_/_0.15)] text-[oklch(0.85_0.14_215)] border-[oklch(0.77_0.14_215_/_0.3)]",
  POST: "bg-[oklch(0.7_0.18_155_/_0.15)] text-[oklch(0.82_0.18_155)] border-[oklch(0.7_0.18_155_/_0.3)]",
  PATCH: "bg-[oklch(0.78_0.16_75_/_0.15)] text-[oklch(0.85_0.16_75)] border-[oklch(0.78_0.16_75_/_0.3)]",
  PUT: "bg-[oklch(0.78_0.16_75_/_0.15)] text-[oklch(0.85_0.16_75)] border-[oklch(0.78_0.16_75_/_0.3)]",
  DELETE: "bg-[oklch(0.62_0.22_25_/_0.15)] text-[oklch(0.78_0.2_25)] border-[oklch(0.62_0.22_25_/_0.3)]",
};

export function MethodBadge({ method, path, className }: { method: Method; path?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 rounded-md border bg-card px-3 py-1.5 text-sm", className)}>
      <span className={cn("rounded px-2 py-0.5 text-xs font-bold border", styles[method])}>{method}</span>
      {path && <code className="font-mono text-foreground">{path}</code>}
    </span>
  );
}

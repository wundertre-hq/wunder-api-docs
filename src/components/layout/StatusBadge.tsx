import { useEffect, useState } from "react";

type Status = "UP" | "HASISSUES" | "UNDERMAINTENANCE" | string;

interface Summary {
  page?: { name?: string; url?: string; status?: Status };
}

const META: Record<string, { label: string; dot: string; ring: string }> = {
  UP: { label: "All systems operational", dot: "bg-emerald-500", ring: "bg-emerald-500/60" },
  HASISSUES: { label: "Service issues", dot: "bg-red-500", ring: "bg-red-500/60" },
  UNDERMAINTENANCE: { label: "Under maintenance", dot: "bg-amber-500", ring: "bg-amber-500/60" },
  UNKNOWN: { label: "Status unavailable", dot: "bg-muted-foreground", ring: "bg-muted-foreground/40" },
};

export function StatusBadge() {
  const [status, setStatus] = useState<Status>("UNKNOWN");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("https://wundertreos.instatus.com/summary.json", { cache: "no-store" });
        const data: Summary = await res.json();
        if (cancelled) return;
        setStatus(data?.page?.status ?? "UNKNOWN");
      } catch {
        if (!cancelled) setStatus("UNKNOWN");
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const meta = META[status] ?? META.UNKNOWN;

  return (
    <a
      href="https://wundertreos.instatus.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent/40 pl-2.5 pr-3 py-1.5 text-xs text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors whitespace-nowrap"
      title={`WundertreOS: ${meta.label}`}
      aria-label={`WundertreOS status: ${meta.label}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className={`absolute inline-flex h-full w-full rounded-full ${meta.ring} opacity-75 animate-ping`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${meta.dot}`} />
      </span>
      <span className="font-medium text-sidebar-foreground/90">WundertreOS</span>
      <span aria-hidden className="h-3 w-px bg-sidebar-border" />
      <span className="text-muted-foreground">{meta.label}</span>
    </a>
  );
}

import { useState, useMemo } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { Search, ChevronDown } from "lucide-react";
import { nav, flatNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import logo from "@/assets/wundertre-os-logo-white.png";
import { StatusBadge } from "@/components/layout/StatusBadge";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [q, setQ] = useState("");

  const fuse = useMemo(() => new Fuse(flatNav, { keys: ["title", "section", "slug"], threshold: 0.35 }), []);
  const results = q.trim() ? fuse.search(q).map((r) => r.item) : null;

  const current = pathname.replace(/^\//, "");

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <Link to="/$" params={{ _splat: "" }} className="flex items-center gap-2">
          <img src={logo} alt="WundertreOS" className="h-7 w-auto" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">API Docs</span>
        </Link>
      </div>
      <div className="px-3 py-3 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search docs..."
            className="w-full rounded-md border border-sidebar-border bg-sidebar-accent/40 py-1.5 pl-8 pr-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
        {results ? (
          <ul className="space-y-0.5">
            {results.length === 0 && (
              <li className="px-2 py-1 text-xs text-muted-foreground">No results</li>
            )}
            {results.map((r) => (
              <li key={r.slug}>
                <Link
                  to="/$"
                  params={{ _splat: r.slug }}
                  onClick={onNavigate}
                  className="block rounded px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <div className="text-sm">{r.title}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.section}</div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-5">
            {nav.map((section) => (
              <NavGroup key={section.title} title={section.title}>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = current === item.slug;
                    return (
                      <li key={item.slug}>
                        <Link
                          to="/$"
                          params={{ _splat: item.slug }}
                          onClick={onNavigate}
                          className={cn(
                            "block rounded px-2 py-1.5 text-[13px] transition-colors",
                            active
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                          )}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </NavGroup>
            ))}
          </div>
        )}
      </nav>
      <div className="border-t border-sidebar-border px-3 py-3">
        <StatusBadge />
      </div>
    </aside>
  );
}

function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mb-1 flex w-full items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        {title}
        <ChevronDown className={cn("h-3 w-3 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && children}
    </div>
  );
}

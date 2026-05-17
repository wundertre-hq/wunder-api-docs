import { useState, Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tab({ children }: { label: string; children: ReactNode }) {
  return <>{children}</>;
}

export function CodeTabs({ children }: { children: ReactNode }) {
  const tabs = Children.toArray(children).filter(isValidElement) as ReactElement<{
    label: string;
    children: ReactNode;
  }>[];
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border bg-[oklch(0.14_0.02_240)]">
      <div className="flex items-center gap-1 border-b border-border bg-[oklch(0.18_0.02_240)] px-2">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "border-b-2 px-3 py-2 text-xs font-medium transition-colors",
              active === i
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.props.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]}</div>
    </div>
  );
}

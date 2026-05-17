import { Info, AlertTriangle, Lightbulb, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const config = {
  info: { icon: Info, cls: "border-primary/40 bg-primary/5 text-foreground" },
  tip: { icon: Lightbulb, cls: "border-[oklch(0.7_0.18_155_/_0.4)] bg-[oklch(0.7_0.18_155_/_0.06)] text-foreground" },
  warn: { icon: AlertTriangle, cls: "border-[oklch(0.78_0.16_75_/_0.4)] bg-[oklch(0.78_0.16_75_/_0.06)] text-foreground" },
  danger: { icon: ShieldAlert, cls: "border-destructive/40 bg-destructive/5 text-foreground" },
} as const;

export function Callout({ type = "info", children, title }: { type?: keyof typeof config; children: ReactNode; title?: string }) {
  const { icon: Icon, cls } = config[type];
  return (
    <div className={cn("my-5 flex gap-3 rounded-lg border p-4", cls)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="text-sm leading-relaxed">
        {title && <div className="mb-1 font-semibold">{title}</div>}
        {children}
      </div>
    </div>
  );
}

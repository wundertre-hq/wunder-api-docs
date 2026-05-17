import type { ComponentProps, ReactNode } from "react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { MethodBadge } from "@/components/docs/MethodBadge";
import { ParamTable, SchemaTable } from "@/components/docs/Tables";
import { Callout } from "@/components/docs/Callout";
import { CodeTabs, Tab } from "@/components/docs/CodeTabs";

function Pre(props: ComponentProps<"pre">) {
  const child = props.children as { props?: { className?: string; children?: string } } | undefined;
  const className = child?.props?.className ?? "";
  const match = /language-(\w+)/.exec(className);
  const code = String(child?.props?.children ?? "").replace(/\n$/, "");
  if (match) {
    return <CodeBlock code={code} language={match[1]} />;
  }
  return <pre {...props} />;
}

export const mdxComponents = {
  pre: Pre,
  MethodBadge,
  ParamTable,
  SchemaTable,
  Callout,
  CodeTabs,
  Tab,
  Lead: ({ children }: { children: ReactNode }) => <p className="lead">{children}</p>,
};

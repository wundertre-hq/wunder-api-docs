import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { OnThisPage } from "@/components/layout/OnThisPage";
import { findNav, nav } from "@/lib/nav";

// Eagerly import all MDX so we can render by slug.
const modules = import.meta.glob<{ default: ComponentType; meta?: { title: string; description?: string } }>(
  "/content/**/*.mdx",
  { eager: true },
);

type Loaded = { Component: ComponentType; meta?: { title: string; description?: string } };

function resolve(slug: string): Loaded | null {
  const key = Object.keys(modules).find((k) => k.endsWith(`/content/${slug}.mdx`) || k.endsWith(`/content/${slug}/index.mdx`));
  if (!key) return null;
  const mod = modules[key];
  return { Component: mod.default, meta: mod.meta };
}

export function DocPage({ slug }: { slug: string }) {
  const loaded = resolve(slug);
  const { current, prev, next } = findNav(slug);

  if (!loaded) {
    return (
      <div className="px-6 py-16">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          No documentation found for <code>{slug}</code>.
        </p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          ← Back to introduction
        </Link>
      </div>
    );
  }

  const { Component, meta } = loaded;
  const section = nav.find((s) => s.items.some((i) => i.slug === slug));

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-10 px-6 py-10 lg:px-10">
      <article className="min-w-0 flex-1">
        {/* Breadcrumbs */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Docs</Link>
          {section && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span>{section.title}</span>
            </>
          )}
          {current && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{current.title}</span>
            </>
          )}
        </nav>

        <div className="docs-prose">
          {meta?.title && <h1>{meta.title}</h1>}
          {meta?.description && <p className="lead">{meta.description}</p>}
          <Component />
        </div>

        {/* Prev/Next */}
        <div className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-6">
          {prev ? (
            <Link
              to="/$"
              params={{ _splat: prev.slug }}
              className="group flex flex-1 flex-col rounded-lg border border-border p-4 hover:border-primary/50"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="h-3 w-3" /> Previous
              </span>
              <span className="mt-1 text-sm font-medium text-foreground group-hover:text-primary">{prev.title}</span>
            </Link>
          ) : <div className="flex-1" />}
          {next ? (
            <Link
              to="/$"
              params={{ _splat: next.slug }}
              className="group flex flex-1 flex-col items-end rounded-lg border border-border p-4 text-right hover:border-primary/50"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                Next <ArrowRight className="h-3 w-3" />
              </span>
              <span className="mt-1 text-sm font-medium text-foreground group-hover:text-primary">{next.title}</span>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </article>

      <OnThisPage />
    </div>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState } from "react";
import { Menu } from "lucide-react";
import { MDXProvider } from "@mdx-js/react";

import appCss from "../styles.css?url";
import logo from "@/assets/wundertre-os-logo-white.png";
import { Sidebar } from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { mdxComponents } from "@/components/docs/mdx-components";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <a href="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Back to docs
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "WundertreOS — Developer Documentation" },
      { name: "description", content: "Official developer documentation for the WundertreOS public API and Zapier integration." },
      { property: "og:title", content: "WundertreOS — Developer Documentation" },
      { name: "twitter:title", content: "WundertreOS — Developer Documentation" },
      { property: "og:description", content: "Official developer documentation for the WundertreOS public API and Zapier integration." },
      { name: "twitter:description", content: "Official developer documentation for the WundertreOS public API and Zapier integration." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fa142877-64c6-4b9d-b610-2d735592113c/id-preview-75778173--2f064af7-31cc-4e26-9570-d1bba4c0f29d.lovable.app-1779127961504.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fa142877-64c6-4b9d-b610-2d735592113c/id-preview-75778173--2f064af7-31cc-4e26-9570-d1bba4c0f29d.lovable.app-1779127961504.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <MDXProvider components={mdxComponents}>
        <div className="min-h-screen bg-background">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:hidden">
            <div className="flex items-center gap-2">
              <img src={logo} alt="WundertreOS" className="h-6 w-auto" />
            </div>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="rounded-md p-2 text-muted-foreground hover:bg-muted">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
          </header>

          <div className="flex">
            <div className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-sidebar-border lg:block">
              <Sidebar />
            </div>
            <main className="min-w-0 flex-1">
              <Outlet />
            </main>
          </div>
        </div>
      </MDXProvider>
    </QueryClientProvider>
  );
}

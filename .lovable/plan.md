# Wundertre OS Developer Docs

Mintlify-style developer documentation site for the Wundertre OS public API and Zapier integration. Built on the current TanStack Start + Tailwind v4 template. Content lives as plain MDX files in the repo. Color palette mirrors the Wundertre Main Website.

## Stack

- TanStack Start + Tailwind v4 (existing template)
- MDX via `@mdx-js/rollup` integrated into the Vite config
- `react-syntax-highlighter` (Prism, dark theme) for code blocks
- `lucide-react` icons
- `fuse.js` for client-side sidebar search

## Brand & design tokens

Pulled from Wundertre Main Website and converted to oklch in `src/styles.css`:

- Navy `#21303f` (210 33% 19%) — sidebar / dark surfaces
- Navy deep `#14202a` (210 33% 12%) — page background (dark default)
- Cyan `#0fbde0` (190 92% 47%) — primary accent (links, focus, GET badge tone)
- Magenta `#e6256b` (339 86% 52%) — accent (CTA highlights)
- Ice `#e8f6fc` (198 80% 96%) — light surface
- Border `210 25% 20%` on dark
- Font: Inter (already used in Wundertre)
- Mono: JetBrains Mono (for code)
- Gradients: `--gradient-cta`, `--gradient-hero`, `--shadow-glow`, `--shadow-card` ported verbatim

HTTP method badge colors:
- GET → cyan, POST → emerald, PATCH → amber, DELETE → magenta/red

## Routes

```
src/routes/
  __root.tsx                 (sidebar + topbar + right TOC + Outlet)
  index.tsx                  (renders Introduction MDX)
  docs.$.tsx                 (catch-all → dynamic import of /content/<path>.mdx)
```

Or simpler: one route file per MDX page (explicit, no dynamic import gymnastics). Given the page count (~30), the catch-all with `import.meta.glob('/content/**/*.mdx')` is cleaner — chosen approach.

## Content layout (MDX files)

```
content/
  getting-started/
    introduction.mdx
    authentication.mdx
    rate-limits.mdx
  contacts/
    list.mdx
    get.mdx
    create.mdx
    update.mdx
    delete.mdx
    deals.mdx
    activities.mdx
    search.mdx
  deals/list.mdx
  activities/list.mdx
  webhooks/
    list.mdx
    create.mdx
    delete.mdx
    events.mdx
    signature-verification.mdx
  oauth/
    authorize.mdx
    token.mdx
    revoke.mdx
    me.mdx
  reference/scopes.mdx
  zapier/
    overview.mdx
    connect.mdx
    triggers.mdx
    actions.mdx
```

Each MDX file exports frontmatter via `export const meta = { title, description, section }` and uses these custom components (auto-provided through `MDXProvider`):

- `<MethodBadge method="GET" path="/api-contacts" />`
- `<ParamTable rows={[...]} />` and `<SchemaTable rows={[...]} />`
- `<CodeTabs>` with `<Tab label="cURL">…</Tab><Tab label="JavaScript">…</Tab>`
- `<Callout type="info|warn|tip">`
- Standard markdown → styled prose (custom `h1/h2/h3/p/ul/code/pre/a`)

Sidebar nav structure lives in `src/lib/nav.ts` as a typed array — single source of truth for the sidebar order and grouping.

## Layout components

- `components/layout/Sidebar.tsx` — Wundertre logo wordmark top-left, search input, collapsible section groups, active link highlight via `useRouterState`. Dark navy background, cyan active accent.
- `components/layout/Topbar.tsx` — breadcrumbs derived from current path + nav.ts; mobile menu button (opens Sheet).
- `components/layout/OnThisPage.tsx` — right-rail TOC built from `h2`/`h3` ids (rehype-slug); scroll-spy via IntersectionObserver. Hidden < lg.
- Mobile (< md): sidebar becomes a `Sheet`, right rail hidden.

## Doc components

- `MethodBadge` — pill, method-colored, mono path
- `CodeBlock` — Prism `oneDark`-ish theme tuned to the navy palette, language label, copy button
- `SchemaTable` / `ParamTable` — shadcn `Table`, columns: name, type, required/nullable, description
- `Callout` — left-border accent, icon by type
- `CodeTabs` — shadcn `Tabs` wrapper for multi-language samples

## Implementation steps

1. Install: `bun add @mdx-js/rollup @mdx-js/react remark-gfm rehype-slug react-syntax-highlighter fuse.js`
2. Wire `@mdx-js/rollup` in `vite.config.ts` with `remark-gfm` + `rehype-slug`
3. Port color tokens to oklch in `src/styles.css`, set dark as default, add mono font + gradient/shadow vars
4. Build layout (`__root.tsx`, Sidebar, Topbar, OnThisPage) and `nav.ts`
5. Build doc components + MDXProvider mapping
6. Catch-all route `docs.$.tsx` that resolves the MDX module from a glob map; `/` renders introduction
7. Author all MDX content (every endpoint includes: method+path, description, auth note, params table, response schema, curl + JS fetch examples, sample JSON)
8. QA: walk ~10 representative pages, verify code highlighting, badges, TOC scroll-spy, mobile sidebar sheet, search

## Open question

Default theme: dark-only (Mintlify-style, matches the Wundertre dark palette best), or include a light/dark toggle using both palettes from the main site? Default to **dark-only** unless you say otherwise.

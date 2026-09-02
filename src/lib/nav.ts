export type NavItem = { title: string; slug: string };
export type NavSection = { title: string; items: NavItem[] };

export const nav: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", slug: "introduction" },
      { title: "Authentication", slug: "authentication" },
      { title: "Rate Limits & Best Practices", slug: "rate-limits" },
    ],
  },
  {
    title: "Contacts",
    items: [
      { title: "List contacts", slug: "contacts/list" },
      { title: "Get contact", slug: "contacts/get" },
      { title: "Create contact", slug: "contacts/create" },
      { title: "Update contact", slug: "contacts/update" },
      { title: "Delete contact", slug: "contacts/delete" },
      { title: "Contact deals", slug: "contacts/deals" },
      { title: "Contact activities", slug: "contacts/activities" },
      { title: "Search contacts", slug: "contacts/search" },
    ],
  },
  {
    title: "Deals",
    items: [{ title: "List deals", slug: "deals/list" }],
  },
  {
    title: "Pipelines",
    items: [
      { title: "List pipelines", slug: "pipelines/list" },
      { title: "List pipeline stages", slug: "pipelines/stages" },
    ],
  },
  {
    title: "Activities",
    items: [{ title: "List activities", slug: "activities/list" }],
  },
  {
    title: "Webhooks",
    items: [
      { title: "List subscriptions", slug: "webhooks/list" },
      { title: "Create subscription", slug: "webhooks/create" },
      { title: "Delete subscription", slug: "webhooks/delete" },
      { title: "Event types", slug: "webhooks/events" },
      { title: "Signature verification", slug: "webhooks/signature" },
    ],
  },
  {
    title: "OAuth",
    items: [
      { title: "Authorize", slug: "oauth/authorize" },
      { title: "Token", slug: "oauth/token" },
      { title: "Revoke", slug: "oauth/revoke" },
      { title: "Identity", slug: "oauth/me" },
    ],
  },
  {
    title: "Reference",
    items: [{ title: "Scopes", slug: "reference/scopes" }],
  },
  {
    title: "Zapier Integration",
    items: [
      { title: "Overview", slug: "zapier/overview" },
      { title: "How to connect", slug: "zapier/connect" },
      { title: "Triggers", slug: "zapier/triggers" },
      { title: "Actions", slug: "zapier/actions" },
    ],
  },
  {
    title: "MCP for AI Agents",
    items: [
      { title: "Overview", slug: "mcp/overview" },
      { title: "Connect an agent", slug: "mcp/connect" },
    ],
  },
];

export const flatNav = nav.flatMap((s) => s.items.map((i) => ({ ...i, section: s.title })));

export function findNav(slug: string) {
  const idx = flatNav.findIndex((i) => i.slug === slug);
  return {
    current: idx >= 0 ? flatNav[idx] : undefined,
    prev: idx > 0 ? flatNav[idx - 1] : undefined,
    next: idx >= 0 && idx < flatNav.length - 1 ? flatNav[idx + 1] : undefined,
  };
}

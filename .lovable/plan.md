
# Accuracy pass on WundertreOS API docs

After reading the actual edge functions in the Wundertre Growth Suite project (`api-contacts`, `api-contacts-search`, `api-deals`, `api-activities`, `api-webhook-subscriptions`, `webhook-dispatcher`, `oauth-authorize`, `oauth-token`, `oauth-me`, `oauth-revoke`, `_shared/api-auth.ts`), most of the MDX content in this docs site is inaccurate. Field names, response envelopes, rate limits, webhook payload shape, and OAuth response shapes are all fabricated. The plan below corrects every page against the real code. No structural / visual changes — content only.

## What's wrong today (highlights)

**Rate limits** — Docs claim 600 rpm (OAuth) / 1,200 rpm (API key) and an `Idempotency-Key` feature. Reality: **60 requests / 60 seconds per org**, both credential types share the limit, no idempotency support. Headers are `X-RateLimit-Limit/Remaining/Reset` and `Retry-After` ✓.

**Auth** — `X-API-Key` is sent as-is and SHA-256 hashed; there is **no `wt_live_` prefix convention**. Bearer tokens are 64 hex chars (no `at_` prefix). Refresh tokens likewise.

**List contacts** — Returns `{ data, meta: { limit, offset, count } }`, **not** `pagination: { total }`. `order` is `asc|desc`, **not** dot notation. Default limit is **100**, max 200. `event=created|tag_added|enriched` is real; values map to internal filters.

**Contact fields** — Real columns are: `id, org_id, first_name, last_name, email, phone, company, company_id, job_title, industry, address_line1, address_line2, city, state, zip, country, tags, status, stage, source, score, notes, linkedin_url, enriched_at, enrichment_status, email_subscribed, created_at, updated_at, created_by`. The docs invented `title`, `lifecycle_stage`, `owner_id`, `custom_fields` — **none exist**. `org_id` (not `workspace_id`) is the tenant key throughout.

**Create contact** — `first_name` is the only required field (not "email or phone"). Defaults: `status="active"`, `source="api"`. No 409 conflict path.

**Activities** — Real columns: `id, org_id, contact_id, activity_type, description, metadata, performed_by, created_at`. Docs use `type/actor_id/body` — wrong. Filter param is `created_since` (not `updated_since`). Top-level `/api-activities` exists and shares the same shape.

**Deals** — Real columns: `id, org_id, contact_id, company_id, pipeline_id, stage_id, title, value, currency, expected_close_date, assigned_to, notes, won_at, lost_at, lost_reason, created_at, updated_at, created_by`. Docs invented `stage` string, `owner_id`. Top-level `/api-deals` accepts `created_since`, `updated_since`, `contact_id`, `limit`, `offset`, `order` and requires the `contacts:read` scope.

**Contact search** — `POST /api-contacts-search` with body fields `email | phone | first_name | last_name | tags | limit` (at least one required, limit default 10 / max 50). Tags filter requires the contact to contain ALL listed tags (`@>` operator).

**Webhooks** — Real event types: `contact.created, contact.updated, contact.tag_added, contact.enriched, contact.note_added, deal.created, deal.updated`. Docs added `contact.deal_added` which doesn't exist. Create response returns the row's `secret` (not `signing_secret`) and `enabled` (not `active`). IDs are UUIDs, not `wh_a1b2c3`.

**Webhook delivery** — Body is `{ id, event_type, org_id, data, delivered_at }` (not `{ type, workspace_id, created_at }`). Headers sent: `X-Wunder-Signature: sha256=<hex>`, `X-Hook-Signature: sha256=<hex>` (same value, for Zapier REST Hooks), `X-Wunder-Event`, `X-Wunder-Delivery`. Retry schedule is **8 attempts** at 0s, 1m, 5m, 15m, 1h, 6h, 6h, 6h.

**OAuth `/oauth-me`** — Returns `{ id, email, org_id, org_name, org_slug }`. The current docs invented nested `user`/`workspace` objects and a `scopes` array — wrong.

**OAuth `/oauth-token`** — Response shape matches (access_token, token_type, expires_in, refresh_token, scope) ✓. PKCE S256 supported, plain not supported.

**OAuth `/oauth-revoke`** — Always returns `{}` 200 (per RFC 7009) — already correct.

**Scopes** — Real scopes used in code: `contacts:read`, `contacts:write`, `webhooks:read`, `webhooks:write`. `contacts:read` is implicit on read endpoints when the auth helper is called without a required scope (for sub-resources like list deals on a contact, no scope is enforced — only org match). `/api-deals` and `/api-activities` top-level **do** require `contacts:read`. `/api-webhook-subscriptions` requires `webhooks:read` to list/get and `webhooks:write` to create/delete.

## Files to rewrite

All MDX files in `content/`. Visual components (`MethodBadge`, `ParamTable`, `SchemaTable`, `Callout`, `CodeBlock`) stay as-is.

```text
content/
  introduction.mdx           (base URL ✓, conventions ✓, drop UUID/workspace_id mismatch)
  authentication.mdx         (drop wt_live_ prefix, keep both methods)
  rate-limits.mdx            (rewrite numbers: 60/60s, drop Idempotency-Key, fix pagination defaults)
  reference/scopes.mdx       (keep 4 scopes, fix the endpoint mapping)
  contacts/list.mdx          (real fields, meta envelope, asc|desc, default 100)
  contacts/get.mdx           (real fields)
  contacts/create.mdx        (first_name required only, real fields, 201 response shape)
  contacts/update.mdx        (allowed-field whitelist, no-op 400 case)
  contacts/delete.mdx        (204 ✓, scope ✓)
  contacts/deals.mdx         (real deal fields, created_since filter, no pagination meta)
  contacts/activities.mdx    (activity_type/description/performed_by, created_since)
  contacts/search.mdx        (POST body schema, tags = ALL, limit 10/50)
  deals/list.mdx             (top-level /api-deals, real fields, contacts:read scope)
  activities/list.mdx        (top-level /api-activities, real fields)
  webhooks/list.mdx          (returns enabled, real fields)
  webhooks/create.mdx        (secret + enabled, UUID ids, webhooks:write scope)
  webhooks/delete.mdx        (204, scope)
  webhooks/events.mdx        (7 real event types, no contact.deal_added)
  webhooks/signature.mdx     (X-Wunder-Signature scheme, payload shape, retry schedule, sample verify code)
  oauth/authorize.mdx        (params ✓, note React consent step is implementation detail)
  oauth/token.mdx            (response ✓; clarify PKCE S256 only)
  oauth/revoke.mdx           (RFC 7009 behavior ✓)
  oauth/me.mdx               (flat { id, email, org_id, org_name, org_slug })
  zapier/overview.mdx        (point to real Zapier triggers/actions)
  zapier/connect.mdx         (OAuth scopes the Zapier app actually asks for)
  zapier/triggers.mdx        (map each trigger → real GET endpoint + event)
  zapier/actions.mdx         (map each action → real POST/PATCH endpoint)
```

## Cross-cutting corrections to apply everywhere

1. Replace `workspace_id` → `org_id`, "workspace" → "organization" (or "workspace" only in marketing copy).
2. Replace fabricated IDs like `wh_a1b2c3`, `at_...`, `rt_...`, `evt_01HXYZ` with realistic UUIDs (`a1b2c3d4-...`) and 64-char hex token examples.
3. Standard response envelope for list endpoints: `{ "data": [...] }`. Only `/api-contacts` list adds `meta: { limit, offset, count }`.
4. Single object responses: `{ "data": { ... } }`. 404 returns `{ "error": "not_found" }`. Auth failure: `{ "error": "unauthorized", "message": "..." }`. Scope failure: `{ "error": "forbidden", "message": "... scope is required." }` (403).
5. Drop every mention of `Idempotency-Key` and `409 conflict`.
6. Fix the `order` parameter description to "`asc` or `desc` (default `desc` — newest first)".

## Implementation steps (build phase)

1. Rewrite the 27 MDX files above in one sweep, using the field lists from the actual `*_SELECT` constants and the real code paths.
2. Update `src/lib/nav.ts` only if a page is renamed (no renames planned — slugs stay the same).
3. Walk the docs in the preview, sampling Contacts/List, Webhooks/Signature, OAuth/Me, Zapier/Triggers to confirm code blocks render and copy buttons still work.

No new dependencies, no schema or component changes.

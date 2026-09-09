# Wundertre Docs Hub

Build a Mintlify-style developer documentation site for the Wundertre OS public API and Zapier integration.

Create a standalone documentation web app (separate from the main app) using React + Vite + Tailwind CSS with a design inspired by Mintlify — dark sidebar navigation, clean typography, code blocks with syntax highlighting, and a professional developer-focused aesthetic.

Site structure and pages to build:

Getting Started

Introduction — what the Wundertre API is, who it's for, base URL (https://api.wundertreos.com/functions/v1/)

Authentication — two methods: (1) OAuth 2.0 Bearer tokens (how to get one via Zapier or direct OAuth), (2) API Keys (X-API-Key header, format wt_...). Show example request headers.

Rate Limits & Best Practices

API Reference — Contacts

GET /api-contacts — list contacts, all query params (event, updated_since, limit, offset, order), response shape

GET /api-contacts/:id — get single contact, response shape

POST /api-contacts — create contact, full request body fields, required vs optional

PATCH /api-contacts/:id — update contact, which fields are updatable

DELETE /api-contacts/:id — delete contact

GET /api-contacts/:id/deals — list deals for a contact

GET /api-contacts/:id/activities — list activities for a contact

POST /api-contacts-search — find contacts by email, name, phone, or tags

API Reference — Deals

GET /api-deals — list deals, query params (created_since, updated_since, contact_id, limit, offset)

API Reference — Activities

GET /api-activities — list activities, query params (created_since, type, contact_id, limit)

API Reference — Webhooks

GET /api-webhook-subscriptions — list subscriptions

POST /api-webhook-subscriptions — subscribe, body: { target_url, event_types[], description }

DELETE /api-webhook-subscriptions/:id — unsubscribe

Event types reference: contact.created, contact.updated, contact.tag_added, contact.enriched, contact.note_added, contact.deal_added, deal.created, deal.updated

Webhook signature verification — X-Wunder-Signature: sha256=<hmac> header, how to verify with HMAC-SHA256

API Reference — OAuth

GET /oauth-authorize — start OAuth flow, params

POST /oauth-token — token exchange and refresh

POST /oauth-revoke — revoke tokens

GET /oauth-me — get connected account identity

Scopes Reference

contacts:read, contacts:write, webhooks:read, webhooks:write — what each scope allows

Zapier Integration Guide

Overview — what you can do with the Wundertre + Zapier integration

How to connect — step by step: go to Zapier → search WundertreOS → connect account → OAuth consent screen walkthrough

Triggers section:

New Contact

Contact Updated

Tag Added to Contact

Contact Enriched

Note Added to Contact

New Deal

Actions section:

Create Contact — fields

Update Contact — fields

Find Contact — search fields

Add Tag to Contact

Create Deal

Design requirements:

Mintlify-style: dark left sidebar with collapsible sections, breadcrumb navigation, right-side "On this page" anchor links

Syntax-highlighted code blocks (use react-syntax-highlighter or prismjs) showing curl examples, JSON request/response bodies for every endpoint

Badges for HTTP methods (GET = blue, POST = green, PATCH = yellow, DELETE = red)

Response schema tables (field name, type, nullable, description)

Search bar in the sidebar

Mobile responsive

Brand colors: use a dark navy/slate theme with a teal or indigo accent (consistent with a modern SaaS dev docs look)

Logo: text "Wundertre OS" in the top-left of the sidebar

Code examples to include for every endpoint — show curl, and optionally JavaScript fetch. Example for contacts list:

curl -X GET \

'https://api.wundertreos.com/functions/v1/api-contacts?limit=50&updated_since=2026-01-01T00:00:00Z' \

-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

Ideally this content can live as indivual articels in a lovable cloud envioment.

Also the project who's documentation this is built for is @project:dac54cf4-bf66-4af4-8c66-a00e12cbdfbf:"Wundertre Growth Suite" so feel free to refercne that for how the api workis and the zapier connection flow if you need to expound on the docs

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://wunder-api-docs.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2f064af7-31cc-4e26-9570-d1bba4c0f29d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

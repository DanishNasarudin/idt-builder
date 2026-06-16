# Architecture

This repo is a small public website plus quote-generation flow built on the
Next.js App Router. The architecture should stay simple: public pages are route
entry points, reusable UI lives in components, and server-only file/email work
lives behind service modules.

## Public Surface

Only these routes are part of the public product surface:

- `/` - PC builder page. Loads the current price list, lets customers choose
  parts, and can restore an existing quote with `?edit=<quote-id>`.
- `/quote/[id]` - shareable quote page. Reads a saved quote, shows selected
  parts, example build images, totals, and customer actions.
- `/sign-in` - Clerk sign-in page for staff/admin access.

Everything else should be treated as internal unless intentionally promoted:

- `app/api/*` - API routes used by forms or server integrations.
- `/pdf` - PDF development/sandbox route.
- `/shadcn` - UI development/sandbox route.
- `/quote-old/[id]` - legacy quote route.

If a new customer-facing page is added, update this section first. That keeps
the public surface explicit and prevents dev routes from becoming accidental
product features.

## Route Ownership

`app/` should stay thin. Route files are responsible for request-scoped work:

- loading data needed for the page,
- shaping that data into component props,
- setting metadata,
- composing page-level UI.

Business logic should move out of route files when it starts to grow. Prefer
placing server data access in `services/`, shared UI state/types in `lib/`, and
display code in `components/`.

Current route responsibilities:

- `app/layout.tsx` owns global metadata, analytics, providers, navbar, and
  footer.
- `app/page.tsx` loads `pricelist/*.txt`, calculates the latest price-list
  timestamp, optionally loads a quote for edit mode, and renders the builder.
- `app/quote/[id]/page.tsx` loads a quote, fetches price-list data for edit
  actions, checks the Clerk user role, fetches example images, and renders the
  quote.
- `app/sign-in/[[...sign-in]]/page.tsx` renders Clerk's sign-in UI.
- `app/api/contact/route.ts` sends contact/quote email through SMTP.

## Data Flow

The app currently uses filesystem-backed data:

- `pricelist/*.txt` is the product catalog.
- `data/<quote-id>.json` is quote storage.

The main builder flow is:

1. `app/page.tsx` calls `getAllPriceList()` from
   `services/textDbPriceListActions.ts`.
2. Price-list text files are parsed into categories and products.
3. `TableForm` initializes the Zustand selection store from that data.
4. Customer selections are converted to `QuoteData` in `lib/zus-store.ts`.
5. Quote data is persisted through `queueWrite()` in
   `services/textDbActions.ts`.
6. The generated quote link points to `/quote/[id]`.

The quote display flow is:

1. `app/quote/[id]/page.tsx` reads `data/<id>.json` through `readData()`.
2. The route maps saved quote data into display rows.
3. It fetches current price-list data so staff/admin users can edit the quote.
4. It optionally asks the photostock service for example build images.
5. Quote components render the shareable page and user actions.

## Module Boundaries

Use these folders as the primary boundaries:

- `app/` - route entry points, layouts, metadata, API handlers.
- `components/custom/` - app-specific UI and workflows.
- `components/custom/quote/` - quote-page and quote-action UI.
- `components/ui/` - generic shadcn-style primitives. Keep these reusable and
  low on business rules.
- `components/pdf/` - React-PDF templates and PDF-specific layout.
- `services/` - server-only integrations and persistence helpers.
- `lib/` - shared providers, utilities, client state, and cross-cutting types.
- `public/` - static assets served by Next.js.
- `docs/` - contributor and architecture documentation.

Avoid importing server-only modules such as `fs`, `nodemailer`, or Clerk server
helpers into client components. Keep `"use server"` service modules called from
routes, API handlers, or server actions.

## Authentication And Authorization

Clerk is the authentication provider.

- `/sign-in` is public and hosts Clerk sign-in.
- The navbar/layout can render inside `CustomClerkProvider`.
- `/quote/[id]` reads `currentUser()` server-side and treats users with
  `privateMetadata.role` of `Admin` or `Staff` as admin-capable.
- `middleware.ts` redirects `/pdf` and `/shadcn` away from production.

Public quote links are intentionally readable without sign-in. Admin-only
actions should be guarded server-side, not only hidden in client UI.

## Integrations

External integrations are deliberately small:

- Clerk for authentication.
- SMTP through Nodemailer for quote/contact emails.
- Photostock API for example build images on quote pages.
- Google Analytics in `app/layout.tsx`.

Keep integration code isolated in route-level server code or `services/`.
If an integration grows beyond a single call site, create a dedicated service
module with typed request/response shapes.

## Simpler Architecture Direction

Prefer this target shape for future cleanup:

- Keep only `/`, `/quote/[id]`, and `/sign-in` as public pages.
- Move quote image lookup out of `app/quote/[id]/page.tsx` into a service.
- Move quote-display data mapping into a small pure helper near the quote
  components or in `lib/`.
- Keep dev-only routes clearly named and blocked from production.
- Keep storage access behind `services/` so replacing the filesystem with a
  database later does not require changing route/component code.
- Treat `QuoteData` in `lib/zus-store.ts` as the shared contract between the
  builder, persistence, and quote page.

The current filesystem storage is acceptable for a stateful server. It is not a
portable persistence layer for stateless/serverless deployments; replacing it
should happen behind `services/textDbActions.ts` and
`services/textDbPriceListActions.ts`.

## Change Guidelines

When adding or changing behavior:

- Start at the route only when the behavior is page-specific.
- Put reusable visual pieces in `components/custom/`.
- Put generic UI primitives in `components/ui/`.
- Put server persistence, SMTP, and external API calls in `services/`.
- Keep public route additions intentional and documented here.
- Verify with `npm run lint` or `npm run typecheck`; do not use
  `npm run build` as the default verification command.
